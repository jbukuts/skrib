import { Grid, Stack } from '@/components/UI/Layout'
import {
  FontFaceSelect,
  FontSizeSlider,
  LineHeightSlider,
  LineNumberSwitch,
  StatisticsSwitch,
  ThemeSelect,
  VariableHeadSwitch
} from '../DerivedUI'
import ResetButton from '../DerivedUI/ResetButton'
import styles from './Settings.module.scss'

export default function Settings() {
  return (
    <Stack dir='vertical' spacing='lg' className={styles.settings}>
      <ThemeSelect showTitle />
      <FontFaceSelect />
      <FontSizeSlider />
      <LineHeightSlider />
      <Grid col={2} row={1} spacing='lg'>
        <StatisticsSwitch />
        <LineNumberSwitch />
        <VariableHeadSwitch />
      </Grid>
      <ResetButton></ResetButton>
    </Stack>
  )
}
