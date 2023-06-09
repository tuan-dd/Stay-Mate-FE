import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import CardOpen from '@/components/CardOpen';

const asks = [
  {
    title: 'What’s the Status of My Booking?',
    context:
      'If you contacted the seller more than 48 hours ago, choose Open a case so Etsy can help you. For qualifying orders, you’ll receive a refund for any item that doesn’t arrive, arrives damaged, or doesn’t match the item description or photos.',
  },
  {
    title: 'How to Contact a Shop',
    context:
      'Contacting a Hotelier through Messages is the best way to get information about an item or resolve any issues you have with your order. Each seller on Etsy manages their own orders, and makes decisions about cancellations, refunds, and returns. Learn more about getting help with your order.',
  },
  {
    title: 'How to Search for hotel in website',
    context:
      'Search results are ordered by how relevant the items are to what you search for. You can change the order of your search results with the Sort by option above the search results.',
  },
  {
    title: 'How to Booking and payment Order',
    context:
      'You can’t purchase an Etsy Gift Card and check out from another shop in the same transaction. If you have other items in your cart, you can purchase them in a separate transaction.',
  },
];

function HelpCenterPage() {
  return (
    <Stack mt={12} alignItems='center' justifyContent='center' spacing={3}>
      {asks.map((ask) => (
        <Box key={ask.title} width={700}>
          <CardOpen {...ask} />
        </Box>
      ))}
    </Stack>
  );
}

export default HelpCenterPage;
