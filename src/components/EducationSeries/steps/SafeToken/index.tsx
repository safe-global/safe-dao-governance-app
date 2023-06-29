import { Accordion, AccordionSummary, Typography, AccordionDetails, List, ListItem, Grid } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { ReactElement } from 'react'

import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'

import css from './styles.module.css'

const InfoAccordion = ({ summaryText, details }: { summaryText: ReactElement | string; details: string[] }) => {
  return (
    <Accordion className={css.accordion} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={css.summary}>
        <Typography className={css.summaryText}>{summaryText}</Typography>
      </AccordionSummary>

      <AccordionDetails className={css.details}>
        <List className={css.list}>
          {details.map((detail, i) => (
            <ListItem key={i}>{detail}</ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}

const SafeToken = ({ onBack, onNext }: { onBack: () => void; onNext: () => void }): ReactElement => {
  return (
    <Grid container px={6} pt={5} pb={4}>
      <Grid item xs={12} mb={3}>
        <StepHeader title="What exactly is the Safe Token and what does it govern?" />
      </Grid>

      <Typography mb={3}>
        SAFE is an ERC-20 governance token that stewards infrastructure components of the <i>Safe</i> ecosystem,
        including:
      </Typography>

      <InfoAccordion
        summaryText="Safe{Core} Protocol"
        details={[
          'Safe{Core} Deployments (smart contract deployments across multiple networks)',
          'Curation of “trusted lists” (token lists, dApp lists, module lists)',
        ]}
      />

      <InfoAccordion
        summaryText="Interfaces"
        details={[
          'Decentralized hosting of a Safe{Wallet} frontend using the safe.eth domain',
          'Decentralized hosting of governance frontends',
        ]}
      />

      <InfoAccordion
        summaryText="On-chain assets"
        details={['ENS names', 'Outstanding Safe Token supply', 'Other Safe{DAO} Treasury assets (NFTs, tokens, etc.)']}
      />

      <InfoAccordion
        summaryText="Tokenomics"
        details={['Ecosystem reward programs', 'User rewards', 'Value capture', 'Future token utility']}
      />

      <NavButtons onBack={onBack} onNext={onNext} />
    </Grid>
  )
}

export default SafeToken
