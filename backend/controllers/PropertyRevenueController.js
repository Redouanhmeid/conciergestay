// controllers/PropertyRevenueController.js
const { PropertyRevenue, Property } = require('../models');
const { Op } = require('sequelize');

const addMonthlyRevenue = async (req, res) => {
 try {
  const { propertyId, amount, month, year, notes, createdBy } = req.body;

  // Check if revenue for this month already exists
  const existingRevenue = await PropertyRevenue.findOne({
   where: { propertyId, month, year },
  });

  if (existingRevenue) {
   return res.status(400).json({
    error: 'Les revenus de ce mois existent déjà',
   });
  }

  const revenue = await PropertyRevenue.create({
   propertyId,
   amount,
   month,
   year,
   notes,
   createdBy,
  });

  res.status(201).json(revenue);
  console.log(res);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Échec de l'ajout de revenus" });
 }
};

const updateMonthlyRevenue = async (req, res) => {
 try {
  const { id } = req.params;
  const { amount, notes, month, year } = req.body;

  const revenue = await PropertyRevenue.findByPk(id);

  if (!revenue) {
   return res
    .status(404)
    .json({ error: 'Enregistrement des revenus non trouvé' });
  }

  // Check if revenue for the updated month and year already exists
  const existingRevenue = await PropertyRevenue.findOne({
   where: { propertyId: revenue.propertyId, month, year },
  });

  if (existingRevenue && existingRevenue.id !== revenue.id) {
   return res
    .status(400)
    .json({ error: 'Les revenus de ce mois existent déjà' });
  }

  await revenue.update({ amount, notes, month, year });

  res.status(200).json(revenue);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Échec de la mise à jour des revenus' });
 }
};

const getPropertyRevenue = async (req, res) => {
 try {
  const { propertyId } = req.params;
  const { year, month } = req.query;

  const whereClause = { propertyId };

  if (year) whereClause.year = year;
  if (month) whereClause.month = month;

  const revenues = await PropertyRevenue.findAll({
   where: whereClause,
   order: [
    ['year', 'DESC'],
    ['month', 'DESC'],
   ],
   include: [
    {
     model: Property,
     as: 'property',
     attributes: ['name'],
    },
   ],
  });

  res.status(200).json(revenues);
 } catch (error) {
  console.error(error);
  res
   .status(500)
   .json({ error: 'Échec de la récupération des données sur les revenus' });
 }
};

const getAnnualRevenue = async (req, res) => {
 try {
  const { propertyId } = req.params;
  const { year } = req.params;

  const revenues = await PropertyRevenue.findAll({
   where: {
    propertyId,
    year,
   },
   order: [['month', 'ASC']],
   attributes: ['month', 'amount', 'notes'],
  });

  const totalRevenue = revenues.reduce(
   (sum, rev) => sum + Number(rev.amount),
   0
  );

  res.status(200).json({
   revenues,
   totalRevenue,
  });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Échec de la récupération du revenu annuele' });
 }
};

const deleteRevenue = async (req, res) => {
 try {
  const { id } = req.params;

  const revenue = await PropertyRevenue.findByPk(id);

  if (!revenue) {
   return res
    .status(404)
    .json({ error: 'Enregistrement des revenus non trouvé' });
  }

  await revenue.destroy();

  res.status(200).json({
   message: "L'enregistrement des revenus a été supprimé avec succès",
  });
 } catch (error) {
  console.error(error);
  res
   .status(500)
   .json({ error: "Impossible de supprimer l'enregistrement des revenus" });
 }
};

module.exports = {
 addMonthlyRevenue,
 updateMonthlyRevenue,
 getPropertyRevenue,
 getAnnualRevenue,
 deleteRevenue,
};
