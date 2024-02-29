import { Paper, PaperProps } from '@mui/material'

const MediumPaper = ({ ...props }: PaperProps) => {
  return <Paper sx={{ ...props.sx, width: '650px', position: 'relative', margin: 'auto' }}>{props.children}</Paper>
}

export default MediumPaper
