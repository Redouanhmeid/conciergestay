import { useState } from 'react';
import axios from 'axios';

const useDeleteProperty = () => {
 const [deletesuccess, setSuccess] = useState(false);
 const [deleteloading, setLoading] = useState(false);
 const [deleteerror, setError] = useState(null);

 const deleteProperty = async (id) => {
  setLoading(true);
  setSuccess(false);
  setError(null);
  try {
   await axios.delete(`/api/v1/properties/${id}`);
   setSuccess(true);
  } catch (err) {
   console.error('Error deleting property:', err);
   setError(err);
  } finally {
   setLoading(false);
  }
 };

 return { deleteProperty, deletesuccess, deleteloading, deleteerror };
};

export default useDeleteProperty;
