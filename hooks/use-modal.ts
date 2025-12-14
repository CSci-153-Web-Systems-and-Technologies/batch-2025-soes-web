import { useState, useCallback } from "react";

/**
 * Custom hook for managing modal state
 * Reduces boilerplate code for modal management across the application
 *
 * @template T - The type of data associated with the modal
 * @param initialData - Optional initial data for the modal
 * @returns Object containing modal state and control functions
 *
 * @example
 * ```tsx
 * const candidateModal = useModal<Candidate>();
 *
 * // Open modal with data
 * candidateModal.open(selectedCandidate);
 *
 * // Open modal without data
 * candidateModal.open();
 *
 * // Close modal
 * candidateModal.close();
 *
 * // Access state
 * console.log(candidateModal.isOpen, candidateModal.data);
 * ```
 */
export function useModal<T = undefined>(initialData?: T) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(initialData ?? null);

  const open = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Optionally clear data after animation completes
    setTimeout(() => {
      setData(null);
    }, 150);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const updateData = useCallback((newData: T | null) => {
    setData(newData);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    updateData,
  };
}

/**
 * Hook variant for managing multiple related modals
 * Useful when you have several modals on the same page
 *
 * @example
 * ```tsx
 * const modals = useMultiModal({
 *   add: false,
 *   edit: false,
 *   delete: false,
 * });
 *
 * modals.open('add');
 * modals.close('edit');
 * console.log(modals.isOpen('add')); // true
 * ```
 */
export function useMultiModal<T extends string>(
  initialStates: Record<T, boolean>
) {
  const [states, setStates] = useState(initialStates);

  const open = useCallback((modalName: T) => {
    setStates((prev) => ({ ...prev, [modalName]: true }));
  }, []);

  const close = useCallback((modalName: T) => {
    setStates((prev) => ({ ...prev, [modalName]: false }));
  }, []);

  const toggle = useCallback((modalName: T) => {
    setStates((prev) => ({ ...prev, [modalName]: !prev[modalName] }));
  }, []);

  const closeAll = useCallback(() => {
    setStates(
      Object.keys(states).reduce((acc, key) => {
        acc[key as T] = false;
        return acc;
      }, {} as Record<T, boolean>)
    );
  }, [states]);

  const isOpen = useCallback(
    (modalName: T) => {
      return states[modalName];
    },
    [states]
  );

  return {
    states,
    open,
    close,
    toggle,
    closeAll,
    isOpen,
  };
}
