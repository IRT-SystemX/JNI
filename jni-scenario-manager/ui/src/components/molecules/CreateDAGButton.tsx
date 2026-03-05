import { Button } from '@mui/material';
import React from 'react';

type Props = {
  codeTemplate?: string | undefined
}

function CreateDAGButton({codeTemplate = undefined}: Props) {
  return (
    <Button
      variant="outlined"
      size="small"
      sx={{
        width: '100px',
      }}
      onClick={async () => {
        const name = window.prompt('Please input the new DAG name', '');
        if (name == '') {
          return;
        }
        if (name?.indexOf(' ') != -1) {
          alert('File name cannot contain space');
          return;
        }
        const resp = await fetch(`${getConfig().apiURL}/dags`, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'new',
            value: name,
          }),
        });
        if (resp.ok) {
          if (codeTemplate) {
              const url = `${getConfig().apiURL}/dags/${name}`;
              const resp = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  action: 'save',
                  value: codeTemplate,
                }),
              });
              if (!resp.ok) {
                const e = await resp.text();
                alert(e);
              }
          }
          window.location.href = `/dags/${name.replace(/.yaml$/, '')}/spec`;
        } else {
          const e = await resp.text();
          alert(e);
        }
      }}
    >
      {codeTemplate ? 'Create': 'New'}
    </Button>
  );
}
export default CreateDAGButton;
