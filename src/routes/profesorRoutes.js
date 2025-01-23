const express = require("express");
const ProfesorController = require("../controllers/profesorController");

const router = express.Router();

// Ruta para obtener todos los profesores
router.get("/", ProfesorController.getAllProfesores);

// Ruta para obtener un profesor por ID
router.get("/:id", ProfesorController.getProfesorById);
router.get("/carreras", ProfesorController.getCarreras); // Obtener todas las carreras

module.exports = router;
