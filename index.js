const express = require("express");

const server = express();

const projects = [];
let numeroRequisicao = 0;

server.use(express.json());

function verifyProjectExists(req, res, next) {
  //Verifica se o id do projeto existe
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "ID not found" });
  }

  return next();
}

function logRequisicoes(req, res, next) {
  numeroRequisicao++;

  console.log(`O número de requisições é: ${numeroRequisicao}`);

  return next();
}

server.use(logRequisicoes);

server.get("/projects", (req, res) => {
  //Lista todos projetos
  res.json(projects);
});

server.post("/projects", (req, res) => {
  //Adiciona um novo projeto
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(project);
});

server.put("/projects/:id", verifyProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id); // Busca dentro do array o id que foi passado como parametro

  project.title = title; // Modifica o title que foi passado pelo json
  return res.json(project);
});

server.delete("/projects/:id", verifyProjectExists, (req, res) => {
  //Metodo para deletar um projeto passando como parametro um ID
  const { id } = req.params;

  const idIndex = projects.findIndex(p => p.id == id);

  projects.splice(idIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", verifyProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000); // http://localhost:3000
