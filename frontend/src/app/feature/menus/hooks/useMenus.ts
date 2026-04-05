import { useState } from "react";

export const useCreateMenu = () => {
  const [loading, setLoading] = useState(false);

  const submit = async (name: string, order: number, parentId?: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/menus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, order, parentId }),
        },
      );
      if (!res.ok) {
        throw new Error("Failed to create menu");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
};

export const useUpdateMenu = () => {
  const [loading, setLoading] = useState(false);

  const update = async (id: string, name: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/menus/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        },
      );
      if (!res.ok) {
        throw new Error("Failed to update menu");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
};

export const useGetAllMenus = () => {
  const [loading, setLoading] = useState(false);
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/menus`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch menus");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchAll, loading };
};

export const useMoveMenu = () => {
  const [loading, setLoading] = useState(false);

  const move = async (
    id: string,
    newParentId: string | null,
    onRefresh?: () => void,
  ) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/menus/${id}/move`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newParentId }),
        },
      );
      if (!res.ok) throw new Error("Failed to move menu");
      onRefresh?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { move, loading };
};

export const useReorderMenu = () => {
  const [loading, setLoading] = useState(false);

  const reorder = async (
    id: string,
    newOrder: number,
    onRefresh?: () => void,
  ) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/menus/${id}/reorder`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newOrder }),
        },
      );
      if (!res.ok) throw new Error("Failed to reorder menu");
      onRefresh?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { reorder, loading };
};

export const useDeleteMenu = () => {
  const [loading, setLoading] = useState(false);
  
    const remove = async (id: string, onRefresh?: () => void) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/menus/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete menu");
      }
      onRefresh?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
};
