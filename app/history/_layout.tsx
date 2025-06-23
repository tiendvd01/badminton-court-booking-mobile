import { Stack } from 'expo-router';
import React from 'react'

function HistoryPageLayout() {
  return (
    <Stack>
        <Stack.Screen name="[bookingId]" options={{ headerShown: false }} />
    </Stack>
  )
}

export default HistoryPageLayout;