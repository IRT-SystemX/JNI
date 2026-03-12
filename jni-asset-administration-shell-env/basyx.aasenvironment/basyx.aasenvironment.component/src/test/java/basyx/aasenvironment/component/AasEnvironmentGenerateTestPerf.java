package basyx.aasenvironment.component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

import org.eclipse.digitaltwin.aas4j.v3.dataformat.SerializationException;
import org.eclipse.digitaltwin.aas4j.v3.dataformat.Serializer;
import org.eclipse.digitaltwin.aas4j.v3.dataformat.json.JsonSerializer;
import org.eclipse.digitaltwin.aas4j.v3.model.AssetAdministrationShell;
import org.eclipse.digitaltwin.aas4j.v3.model.Environment;
import org.eclipse.digitaltwin.aas4j.v3.model.Key;
import org.eclipse.digitaltwin.aas4j.v3.model.KeyTypes;
import org.eclipse.digitaltwin.aas4j.v3.model.ModellingKind;
import org.eclipse.digitaltwin.aas4j.v3.model.Reference;
import org.eclipse.digitaltwin.aas4j.v3.model.ReferenceTypes;
import org.eclipse.digitaltwin.aas4j.v3.model.Submodel;
import org.eclipse.digitaltwin.aas4j.v3.model.SubmodelElement;
import org.eclipse.digitaltwin.aas4j.v3.model.impl.DefaultAssetAdministrationShell;
import org.eclipse.digitaltwin.aas4j.v3.model.impl.DefaultEnvironment;
import org.eclipse.digitaltwin.aas4j.v3.model.impl.DefaultKey;
import org.eclipse.digitaltwin.aas4j.v3.model.impl.DefaultProperty;
import org.eclipse.digitaltwin.aas4j.v3.model.impl.DefaultReference;
import org.eclipse.digitaltwin.aas4j.v3.model.impl.DefaultSubmodel;
import org.eclipse.digitaltwin.basyx.aasenvironment.MetamodelCloneCreator;

public class AasEnvironmentGenerateTestPerf {

	private static MetamodelCloneCreator cloneCreator = new MetamodelCloneCreator();
	private static Serializer jsonSerializer = new JsonSerializer();

	//Total Number AAS to generate
	private static int NB_AAS = 1;
	
	//Number of Submodels to generate for each AAS
	private static int NB_SM = 10;

	//Generated AAS json file path
	private static String FILE_PATH = "C:/Users/mohamed-firas.barrak/Desktop/testPerf/SC_A1";
	
	//Generated AAS json file Name
	private static String FILE_NAME = "AAS_SC_A1.json";

	public static void main(String[] args) throws SerializationException {
		List<AssetAdministrationShell> generatedAasList = new ArrayList<>();
		List<Submodel> generatedSubmodelsList = new ArrayList<>();

		for (int i = 1; i <= NB_AAS; i++) {
			AssetAdministrationShell generatedAas = generateAAS("https://example.com/ids/aas/" + i, "AasTest" + i);
			List<Reference> aasSmRefs = new ArrayList<Reference>();
			for (int j = 1; j <= NB_SM; j++) {
				aasSmRefs.add(generateRef("https://example.com/ids/aas/"+i+"/sm/" + j));
				generatedSubmodelsList.add(generateSubmodel("https://example.com/ids/aas/"+i+"/sm/" + j, "SubmodelTestAas" + i+"SM"+j));
			}
			generatedAas.setSubmodels(aasSmRefs);
			generatedAasList.add(generatedAas);
		}
		
		Environment generatedAasEnv = createEnvironment(generatedAasList, generatedSubmodelsList);
		String jsonStringAasEnv = jsonSerializer.write(generatedAasEnv);
		writeAasEnv(jsonStringAasEnv);
		System.out.println("End generating " + NB_AAS + " AAS with " + NB_SM + " submodel for each.");
		System.out.println("Please find the generated Json file \"" + FILE_NAME + "\" under \"" + FILE_PATH + "\"");
	}

	private static AssetAdministrationShell generateAAS(String id, String idShort) {
		AssetAdministrationShell generatedAas = new DefaultAssetAdministrationShell();
		generatedAas.setId(id);
		generatedAas.setIdShort(idShort);
		return generatedAas;
	}

	private static Reference generateRef(String generatedSmId) {
		Reference rf = new DefaultReference();
		rf.setType(ReferenceTypes.EXTERNAL_REFERENCE);

		List<Key> keys = new ArrayList<>();
		Key k = new DefaultKey();

		k.setType(KeyTypes.SUBMODEL);
		k.setValue(generatedSmId);
		keys.add(k);

		rf.setKeys(keys);
		return rf;
	}

	private static Environment createEnvironment(List<AssetAdministrationShell> aas, List<Submodel> submodels) {
		Environment aasEnvironment = new DefaultEnvironment();
		aasEnvironment.setAssetAdministrationShells(cloneCreator.cloneAssetAdministrationShells(aas));
		aasEnvironment.setSubmodels(cloneCreator.cloneSubmodels(submodels));
		return aasEnvironment;
	}

	private static Submodel generateSubmodel(String id, String idShort) {
		Submodel generatedSm = new DefaultSubmodel();
		generatedSm.setId(id);
		generatedSm.setIdShort(idShort);
		generatedSm.setKind(ModellingKind.INSTANCE);

		List<SubmodelElement> smEls = new ArrayList<SubmodelElement>();
		SubmodelElement smProp = new DefaultProperty();
		smProp.setIdShort("name");
		smEls.add(smProp);

		generatedSm.setSubmodelElements(smEls);

		return generatedSm;
	}

	private static void writeAasEnv(String generatedAasEnv) {
		Path filePath = Paths.get(FILE_PATH, FILE_NAME);
		try {
			// Write content to file
			Files.writeString(filePath, generatedAasEnv, StandardOpenOption.CREATE);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}