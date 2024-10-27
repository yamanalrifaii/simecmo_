import { useColorMode, Switch } from '@chakra-ui/react';

export function ColorModeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
  );
}
