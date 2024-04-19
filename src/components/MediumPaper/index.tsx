import { Paper, PaperProps } from '@mui/material'
import css from './styles.module.css'

const MediumPaper = ({ ...props }: PaperProps) => {
  return <Paper className={css.mediumPaper}>{props.children}</Paper>
}

export default MediumPaper
