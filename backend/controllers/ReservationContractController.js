const { ReservationContract } = require('../models');

// Create a new contract
const createContract = async (req, res) => {
 try {
  const contractData = req.body;
  const contract = await ReservationContract.createContract(contractData);
  res.status(201).json(contract);
 } catch (error) {
  console.error('Error creating contract:', error);
  res.status(500).json({
   error: 'Failed to create contract',
   details: error.message,
  });
 }
};

// Update an existing contract
const updateContract = async (req, res) => {
 const { id } = req.params;
 const updatedData = req.body;

 try {
  const contract = await ReservationContract.findByPk(id);
  if (!contract) {
   return res.status(404).json({ error: 'Contract not found' });
  }
  await contract.update(updatedData);
  res.status(200).json(contract);
 } catch (error) {
  console.error('Error updating contract:', error);
  res.status(500).json({
   error: 'Failed to update contract',
   details: error.message,
  });
 }
};

// Delete an existing contract
const deleteContract = async (req, res) => {
 try {
  const { id } = req.params;
  const contract = await ReservationContract.findByPk(id);

  if (!contract) {
   return res.status(404).json({ error: 'Contract not found' });
  }

  // Check if contract can be deleted (e.g., not already signed)
  if (contract.status === 'SIGNED' || contract.status === 'COMPLETED') {
   return res.status(400).json({
    error: 'Cannot delete a signed or completed contract',
   });
  }

  await contract.destroy();
  res.status(200).json({ message: 'Contract deleted successfully' });
 } catch (error) {
  console.error('Error deleting contract:', error);
  res.status(500).json({
   error: 'Failed to delete contract',
   details: error.message,
  });
 }
};

// Get all contracts for a property
const getContractsForProperty = async (req, res) => {
 const { propertyId } = req.params;
 try {
  const contracts = await ReservationContract.findContractsByProperty(
   propertyId
  );
  res.status(200).json(contracts);
 } catch (error) {
  console.error('Error getting contracts:', error);
  res.status(500).json({
   error: 'Failed to get contracts',
   details: error.message,
  });
 }
};

// Get contract by ID
const getContractById = async (req, res) => {
 const { id } = req.params;
 try {
  const contract = await ReservationContract.findByPk(id);
  if (!contract) {
   return res.status(404).json({ error: 'Contract not found' });
  }
  res.json(contract);
 } catch (error) {
  console.error('Error getting contract:', error);
  res.status(500).json({
   error: 'Error getting contract by ID',
   details: error.message,
  });
 }
};

// Update contract status
const updateContractStatus = async (req, res) => {
 const { id } = req.params;
 const { status } = req.body;

 try {
  const contract = await ReservationContract.findByPk(id);
  if (!contract) {
   return res.status(404).json({ error: 'Contract not found' });
  }

  // Validate status transition
  const validTransitions = {
   DRAFT: ['SENT'],
   SENT: ['SIGNED', 'REJECTED'],
   SIGNED: ['COMPLETED'],
   REJECTED: [],
   COMPLETED: [],
  };

  if (!validTransitions[contract.status].includes(status)) {
   return res.status(400).json({
    error: `Invalid status transition from ${contract.status} to ${status}`,
   });
  }

  // Update status and related fields
  const updateData = {
   status,
   ...(status === 'SIGNED' && {
    signedAt: new Date(),
    signingIpAddress: req.ip,
   }),
  };

  await contract.update(updateData);
  res.status(200).json(contract);
 } catch (error) {
  console.error('Error updating contract status:', error);
  res.status(500).json({
   error: 'Failed to update contract status',
   details: error.message,
  });
 }
};

// Check property availability
const checkAvailability = async (req, res) => {
 const { propertyId } = req.params;
 const { startDate, endDate } = req.query;

 try {
  const isAvailable = await ReservationContract.checkAvailability(
   propertyId,
   new Date(startDate),
   new Date(endDate)
  );

  res.status(200).json({
   available: isAvailable,
   dates: { startDate, endDate },
  });
 } catch (error) {
  console.error('Error checking availability:', error);
  res.status(500).json({
   error: 'Failed to check availability',
   details: error.message,
  });
 }
};

module.exports = {
 createContract,
 updateContract,
 deleteContract,
 getContractsForProperty,
 getContractById,
 updateContractStatus,
 checkAvailability,
};
