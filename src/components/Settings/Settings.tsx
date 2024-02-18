import {
  ColorHeadingSwitch,
  CursorBlinkSwitch,
  CursorMoveSwitch,
  FontFaceSelect,
  FontSizeSlider,
  LineHeightSlider,
  LineNumberSwitch,
  ResetButton,
  StatisticsSwitch,
  ThemeSelect,
  UnderlineHeadingSwitch,
  VariableHeadSwitch
} from '@/components/DerivedUI'
import { Grid, Stack } from '@/components/UI/Layout'
import styles from './Settings.module.scss'

function SubHeading(props: { children: React.ReactNode }) {
  return <h4 style={{ margin: '0' }}>{props.children}</h4>
}

export default function Settings() {
  return (
    <Stack dir='vertical' spacing='lg' className={styles.settings}>
      <ThemeSelect showTitle />
      <FontFaceSelect />
      <FontSizeSlider />
      <LineHeightSlider />

      <Stack dir='vertical'>
        <SubHeading>General</SubHeading>
        <Grid col={2}>
          <StatisticsSwitch />
          <LineNumberSwitch />
        </Grid>
      </Stack>

      <Stack dir='vertical'>
        <SubHeading>Cursor</SubHeading>
        <Grid col={2}>
          <CursorBlinkSwitch />
          <CursorMoveSwitch />
        </Grid>
      </Stack>

      <Stack dir='vertical'>
        <SubHeading>Headings</SubHeading>
        <Grid col={2}>
          <VariableHeadSwitch />
          <ColorHeadingSwitch />
          <UnderlineHeadingSwitch />
        </Grid>
      </Stack>

      <ResetButton></ResetButton>
    </Stack>
  )
}
