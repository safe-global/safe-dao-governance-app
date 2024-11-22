import { Box, Button } from '@mui/material'
import { useCoolMode } from '@/hooks/useCoolMode'

const ClaimButton = ({ startClaiming }: { startClaiming: () => void }) => {
  const particlesRef = useCoolMode('./images/token.svg')

  return (
    <Box ref={particlesRef}>
      <Button
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: 'static.main',
          color: 'text.primary',
          '&:hover': { backgroundColor: 'static.main' },
        }}
        onClick={startClaiming}
      >
        Start claiming
      </Button>
    </Box>
  )
}

export default ClaimButton