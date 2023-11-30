import { Box } from "@mui/material"
import { DeckCard } from "../../components/DeckCard/DeckCard"

export const BoardCenter = ({selectedCards}) => {
  return (
    <Box>
      <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
        <Box>
          {selectedCards[1] && <DeckCard key={selectedCards[1].key} card={selectedCards[1]} />}
        </Box>
        <Box>
          {selectedCards[2] && <DeckCard key={selectedCards[2].key} card={selectedCards[2]} />}
        </Box>
      </Box>

      <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)'}}>
        <Box></Box>
        <Box>
          {selectedCards[3] && <DeckCard key={selectedCards[3].key} card={selectedCards[3]} />}
        </Box>
        <Box></Box>
        <Box>
          {selectedCards[4] && <DeckCard key={selectedCards[4].key} card={selectedCards[4]} />}
        </Box>
        <Box></Box>
      </Box>

      <Box sx={{display: 'grid', gridTemplateColumns: '1fr'}}>
        <Box>
          {selectedCards[0] && <DeckCard key={selectedCards[0].key} card={selectedCards[0]} />}
        </Box>
      </Box>
    </Box>
  )
}