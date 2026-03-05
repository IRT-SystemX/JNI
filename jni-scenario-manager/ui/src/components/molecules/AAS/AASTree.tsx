import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography, TextField, InputAdornment, Autocomplete } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import {
  unstable_useTreeItem2 as useTreeItem2,
  UseTreeItem2Parameters,
} from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Checkbox,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { Collapse } from '@mui/material';
import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import { Submodel, SubmodelElement } from './types';

type Props = {
  subModels: Submodel[];
  handleSelectedElementId: (id: string) => void;
};

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[400],
  position: 'relative',
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(3.5),
  },
}));

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  flexDirection: 'row-reverse',
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  fontWeight: 500,
  [`&.Mui-expanded `]: {
    '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
      color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
    },
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

const StyledTreeItemLabelText = styled(Typography)({
  color: 'inherit',
  fontWeight: 500,
});

interface CustomLabelProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  expandable?: boolean;
}

function CustomLabel({ icon: Icon, expandable, children, ...other }: CustomLabelProps) {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {Icon && <Box component={Icon} className="labelIcon" color="inherit" sx={{ mr: 1, fontSize: '1.2rem' }} />}
      <StyledTreeItemLabelText variant="body2">{children}</StyledTreeItemLabelText>
      {expandable && <Box component="span" sx={{ ml: 1 }}>•</Box>}
    </TreeItem2Label>
  );
}

interface CustomTreeItemProps extends Omit<UseTreeItem2Parameters, 'rootRef'>, Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props: CustomTreeItemProps, ref: React.Ref<HTMLLIElement>) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const expandable = children.length > 0;
  const icon = expandable ? FolderIcon : DescriptionIcon

  return (
    <TreeItem2Provider itemId={itemId}>
      <StyledTreeItemRoot {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx('content', {
              'Mui-expanded': status.expanded,
              'Mui-selected': status.selected,
              'Mui-focused': status.focused,
              'Mui-disabled': status.disabled,
            }),
          })}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <CustomLabel {...getLabelProps({ icon, expandable: expandable && status.expanded })} />
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </StyledTreeItemRoot>
    </TreeItem2Provider>
  );
});

const filterItems = (items: Submodel[], term: string): Submodel[] => {
  if (!term) return items;

  return items.reduce((acc: Submodel[], item) => {
    const matchesSearch = item.label.toLowerCase().includes(term.toLowerCase());
    const filteredChildren = item.children ? filterItems(item.children, term) : [];

    if (matchesSearch || filteredChildren.length > 0) {
      acc.push({
        ...item,
        children: filteredChildren,
      });
    }

    return acc;
  }, []);
};

const getAllSearchOptions = (items: Submodel[]): string[] => {
  return items.reduce((acc: string[], item) => {
    acc.push(item.label);
    if (item.children) {
      acc.push(...getAllSearchOptions(item.children));
    }
    return acc;
  }, []);
};

export const AASTree = React.memo(({ subModels, handleSelectedElementId, simulationParamsObjects }: Props) => {
  // TODO: use for the autocomplete options simulationParamsObjects
  
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleSelectedItemsChange = (_: any, ids: string[]) => {
    setSelectedItems(ids);
    handleSelectedElementId(ids[0]);
  };

  const getAllItemIds = (items: Submodel[]): string[] => {
    return items.reduce((acc: string[], item) => {
      acc.push(item.id);
      if (item.children) {
        acc.push(...getAllItemIds(item.children));
      }
      return acc;
    }, []);
  };

  useEffect(() => {
    const allOptions = getAllSearchOptions(subModels);
    // You can do something with allOptions if needed
  }, [subModels]);

  return (
    <Box sx={{
      flexGrow: 1,
      minHeight: 200,
      overflowY: 'auto',
      padding: 2,
    }}>
      <Autocomplete
        freeSolo
        options={getAllSearchOptions(subModels)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            placeholder="Search items..."
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}
        onInputChange={(event, newInputValue) => {
          setSearchTerm(newInputValue);
          // Expand all items when searching
          if (newInputValue) {
            const allIds = getAllItemIds(subModels);
            setExpandedItems(allIds);
          } else {
            setExpandedItems([]);
          }
        }}
        renderOption={(props, option) => (
          <li {...props}>
            {option}
          </li>
        )}
      />
      <RichTreeView
        items={filterItems(subModels, searchTerm)}
        selectedItems={selectedItems}
        expandedItems={expandedItems}
        onSelectedItemsChange={handleSelectedItemsChange}
        onExpandedItemsChange={(_, ids) => setExpandedItems(ids)}
        getItemLabel={(item) => item.label}
        getItemId={(item) => item.id ?? Math.random().toString()}
        multiSelect
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
});
