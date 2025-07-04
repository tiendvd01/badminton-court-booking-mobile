import socket from '@/libs/socket';
import { useAuthStore } from '@/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react'

function useSocketRevalidate() {
  const { user, isAuthenticated, token } = useAuthStore();
  const queryClient = useQueryClient();


  useEffect(() => {
    if (isAuthenticated && user?.id) {
      socket.auth = { ...socket.auth, token };
      socket.connect();

      socket.on("revalidate", () => {
        // Trigger a revalidation event, e.g., to refresh data
        console.log("Revalidation triggered");
       queryClient.invalidateQueries();
      });
    }

    // Cleanup on unmount
    return () => {
      socket.off(`revalidate`)
      socket.disconnect();
    }
  }, [isAuthenticated, token, user?.id])

  return { socket }
}

export default useSocketRevalidate