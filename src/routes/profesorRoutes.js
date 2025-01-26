const express = require("express");
const ProfesorController = require("../controllers/profesorController");

const router = express.Router();

router.get("/", ProfesorController.getAllProfesores);
router.get("/:id", ProfesorController.getProfesorById);
router.get("/carreras", ProfesorController.getCarreras); 

module.exports = router;
