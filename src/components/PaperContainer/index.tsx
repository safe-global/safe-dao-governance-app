import { Paper, PaperProps } from '@mui/material'
import css from './styles.module.css'

const PaperContainer = (props: PaperProps) => {
  return (
    <Paper className={css.paper} {...props}>
      {props.children}
    </Paper>
  )
}

export default PaperContainer
