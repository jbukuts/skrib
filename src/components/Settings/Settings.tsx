import {
  CursorBlinkSwitch,
  CursorMoveSwitch,
  FontFaceSelect,
  FontSizeSlider,
  LineHeightSlider,
  LineNumberSwitch,
  ResetButton,
  StatisticsSwitch,
  ThemeSelect,
  VariableHeadSwitch
} from '@/components/DerivedUI'
import { Grid, Stack } from '@/components/UI/Layout'
import styles from './Settings.module.scss'

export default function Settings() {
  return (
    <Stack dir='vertical' spacing='lg' className={styles.settings}>
      <ThemeSelect showTitle />
      <FontFaceSelect />
      <FontSizeSlider />
      <LineHeightSlider />
      <Grid col={2} row={3} spacing='lg'>
        <StatisticsSwitch />
        <LineNumberSwitch />
        <CursorBlinkSwitch />
        <CursorMoveSwitch />
        <VariableHeadSwitch />
      </Grid>
      <ResetButton></ResetButton>
    </Stack>
  )
}
