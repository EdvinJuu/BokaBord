// make sure to implement aria-live

import type { ReactNode } from "react";

interface DataBoundaryProps<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
  children: (data: T) => ReactNode;
}
// WORKING GOOD, NEED TO MAKE ERRORS MORE USER FRIENDLY I.E NOT DIRECT ERRORS, JUST LAYMAN EXPLANATION WHAT IT IS
function DataBoundary<T>({
  isLoading,
  error,
  data,
  children,
}: DataBoundaryProps<T>) {
  if (isLoading) return <p>Loading...</p>;
  if (error) {
    return <p>{error}</p>;
  }
  if (data === null) {
    return <p>No data available.</p>;
  }
  return <>{children(data)}</>;
}

export default DataBoundary;
