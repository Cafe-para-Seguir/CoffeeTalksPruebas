CREATE SCHEMA `uncafeparaseguir` ;
USE uncafeparaseguir;

CREATE TABLE `uncafeparaseguir`.`tbrol` (
  `idRol` INT NOT NULL AUTO_INCREMENT,
  `nombreRol` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`idRol`));

CREATE TABLE `uncafeparaseguir`.`tbcategoria` (
  `idCategoria` INT NOT NULL AUTO_INCREMENT,
  `nombreCategoria` VARCHAR(45) NOT NULL,
  `descripcionCategoria` VARCHAR(400) NULL,
  `imagenCategoria` VARCHAR(200) NOT NULL,
  `fechaCreacion` TIMESTAMP NOT NULL,
  `usuarioCreacion` VARCHAR(45) NOT NULL,
  `fechaModificacion` TIMESTAMP NOT NULL,
  `usuarioModificacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idcategoria`));

CREATE TABLE `uncafeparaseguir`.`tbreceta` (
  `idReceta` INT NOT NULL AUTO_INCREMENT,
  `nombreReceta` VARCHAR(60) NOT NULL,
  `descripcionReceta` VARCHAR(800) NOT NULL,
  `fechaCreacion` TIMESTAMP NOT NULL,
  `usuarioCreacion` VARCHAR(45) NOT NULL,
  `fechaModificacion` TIMESTAMP NOT NULL,
  `usuarioModificacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idReceta`));

CREATE TABLE `uncafeparaseguir`.`tbcodigousuario` (
  `idCodigoUsuario` INT NOT NULL AUTO_INCREMENT,
  `correoUsuario` VARCHAR(45) NOT NULL,
  `codigo` VARCHAR(8) NULL,
  `tipoCodigo` INT NULL,
  `fechaCreacion` TIMESTAMP NOT NULL,
  PRIMARY KEY (`idCodigoUsuario`),
  KEY (`fechaCreacion`));

CREATE TABLE `uncafeparaseguir`.`tbusuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `nombreUsuario` VARCHAR(45) NOT NULL,
  `apellidosUsuario` VARCHAR(70) NOT NULL,
  `descripcionUsuario` VARCHAR(200) NULL,
  `correoUsuario` VARCHAR(45) UNIQUE NOT NULL,
  `claveUsuario` VARCHAR(200) NOT NULL,
  `imagenUsuario` VARCHAR(100) NULL,
  `opcionNotificacion` VARCHAR(15) NULL,
  `idRol` INT NOT NULL,
  `estadoUsuario` VARCHAR(15) NOT NULL,
  `validadoUsuario` INT NOT NULL,
  `valoracionCharlista` DOUBLE,
  `fechaCreacion` TIMESTAMP NOT NULL,
  `usuarioCreacion` VARCHAR(45) NOT NULL,
  `fechaModificacion` TIMESTAMP NOT NULL,
  `usuarioModificacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idUsuario`),
  KEY(`fechaCreacion`),

  INDEX `idUsuario_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `idRol`
    FOREIGN KEY (`idRol`)
    REFERENCES `uncafeparaseguir`.`tbrol` (`idRol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `uncafeparaseguir`.`tbcharla` (
  `idCharla` INT NOT NULL AUTO_INCREMENT,
  `nombreCharla` VARCHAR(70) NOT NULL,
  `descripcionCharla` VARCHAR(800) NOT NULL,
  `nivelCharla` VARCHAR(150) NOT NULL,
  `valoracionCharla` DOUBLE,
  `imagenCharla` VARCHAR(200) NOT NULL,
  `precioCharla` DOUBLE NOT NULL,
  `fechaCreacion` TIMESTAMP NOT NULL,
  `usuarioCreacion` VARCHAR(45) NOT NULL,
  `fechaModificacion` TIMESTAMP NOT NULL,
  `usuarioModificacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idCharla`));

CREATE TABLE `uncafeparaseguir`.`tbvideo` (
  `idVideo` INT NOT NULL AUTO_INCREMENT,
  `linkVideo` VARCHAR(300) NOT NULL,
  `nombreVideo` VARCHAR(300) NOT NULL,
  `duracionVideo` VARCHAR(30) NOT NULL,
  `ordenVideo` INT NOT NULL,
  `fechaCreacion` TIMESTAMP NOT NULL,
  `usuarioCreacion` VARCHAR(45) NOT NULL,
  `fechaModificacion` TIMESTAMP NOT NULL,
  `usuarioModificacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idVideo`));

CREATE TABLE `uncafeparaseguir`.`tbforo` (
  `idForo` INT NOT NULL AUTO_INCREMENT,
  `idCharla` INT NOT NULL,
  `idUsuario` INT NOT NULL,
  `idComentario` INT NULL,
  `comentarioForo` VARCHAR(200) NOT NULL,
  `fechaComentario` TIMESTAMP NOT NULL,
  PRIMARY KEY (`idforo`),
  INDEX `idCharlaForo_idx` (`idCharla` ASC) VISIBLE,
  INDEX `idUsuarioForo_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `idCharlaForo`
    FOREIGN KEY (`idCharla`)
    REFERENCES `uncafeparaseguir`.`tbcharla` (`idCharla`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `idUsuarioForo`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `uncafeparaseguir`.`tbusuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `uncafeparaseguir`.`tbrecetausuario` (
  `idRecetaUsuario` INT NOT NULL AUTO_INCREMENT,
  `idReceta` INT NULL,
  `idUsuario` INT NULL,
  PRIMARY KEY (`idRecetaUsuario`),
  INDEX `idReceta_idx` (`idReceta` ASC) VISIBLE,
  INDEX `idUsuario_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `idReceta`
    FOREIGN KEY (`idReceta`)
    REFERENCES `uncafeparaseguir`.`tbreceta` (`idReceta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `idUsuario`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `uncafeparaseguir`.`tbusuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `uncafeparaseguir`.`tbcharlacategoria` (
  `idCharlaCategoria` INT NOT NULL AUTO_INCREMENT,
  `idCharla` INT NOT NULL,
  `idCategoria` INT NOT NULL,
  PRIMARY KEY (`idCharlaCategoria`),
  INDEX `idCharla_idx` (`idCharla` ASC) VISIBLE,
  INDEX `idCategoria_idx` (`idCategoria` ASC) VISIBLE,
  CONSTRAINT `idCategoriaCharla1`
    FOREIGN KEY (`idCategoria`)
    REFERENCES `uncafeparaseguir`.`tbcategoria` (`idCategoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `idcharlaCategoria1`
    FOREIGN KEY (`idCharla`)
    REFERENCES `uncafeparaseguir`.`tbcharla` (`idCharla`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `uncafeparaseguir`.`tbcharlausuario` (
  `idCharlaUsuario` INT NOT NULL AUTO_INCREMENT,
  `idUsuario` INT NOT NULL,
  `idCharla` INT NOT NULL,
  `valoracionCharla` INT NOT NULL,
  `finalizado` VARCHAR(5) NOT NULL,
  `fechaMatricula` TIMESTAMP NOT NULL,
  `fechaFinalizacion` TIMESTAMP NULL,
  PRIMARY KEY (`idCharlaUsuario`),
  INDEX `idUsuario_idx` (`idUsuario` ASC) VISIBLE,
  INDEX `idCharla_idx` (`idCharla` ASC) VISIBLE,
  CONSTRAINT `idUsuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `uncafeparaseguir`.`tbusuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `idCharla`
    FOREIGN KEY (`idCharla`)
    REFERENCES `uncafeparaseguir`.`tbcharla` (`idCharla`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `uncafeparaseguir`.`tbcharlacharlista` (
  `idCharlaCharlista` INT NOT NULL AUTO_INCREMENT,
  `idCharla` INT NOT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idCharlaCharlista`),
  INDEX `idCharlaC_idx` (`idCharla` ASC) VISIBLE,
  INDEX `idUsuarioC_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `idCharlaCharl`
    FOREIGN KEY (`idCharla`)
    REFERENCES `uncafeparaseguir`.`tbcharla` (`idCharla`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `idUsuarioCharl`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `uncafeparaseguir`.`tbusuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `uncafeparaseguir`.`tbvideocharla` (
  `idVideoCharla` INT NOT NULL AUTO_INCREMENT,
  `idVideo` INT NOT NULL,
  `idCharla` INT NOT NULL,
  PRIMARY KEY (`idvideocharla`),
  INDEX `idVideo_idx` (`idVideo` ASC) VISIBLE,
  INDEX `idCharlaV_idx` (`idCharla` ASC) VISIBLE,
  CONSTRAINT `idVideoC`
    FOREIGN KEY (`idVideo`)
    REFERENCES `uncafeparaseguir`.`tbvideo` (`idVideo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `idCharlaV`
    FOREIGN KEY (`idCharla`)
    REFERENCES `uncafeparaseguir`.`tbcharla` (`idCharla`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `uncafeparaseguir`.`tbvideousuario` (
  `idvideousuario` INT NOT NULL AUTO_INCREMENT,
  `idusuario` INT NOT NULL,
  `idvideo` INT NOT NULL,
  `visualizado` INT NOT NULL,
  PRIMARY KEY (`idvideousuario`),
  INDEX `idvideousuario_idx` (`idusuario` ASC) VISIBLE,
  INDEX `idvideousuario_idx1` (`idvideo` ASC) VISIBLE,
  CONSTRAINT `idusuariovideo`
    FOREIGN KEY (`idusuario`)
    REFERENCES `uncafeparaseguir`.`tbusuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `idvideousuario`
    FOREIGN KEY (`idvideo`)
    REFERENCES `uncafeparaseguir`.`tbvideo` (`idVideo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO tbrol (nombreRol)values 
  ('Administrador'),
  ('Charlista'),
  ('Cliente');

INSERT INTO tbusuario (nombreUsuario, apellidosUsuario, descripcionUsuario, correoUsuario, claveUsuario, imagenUsuario, opcionNotificacion, idRol, estadoUsuario, validadoUsuario, valoracionCharlista, fechaCreacion, usuarioCreacion, 
    fechaModificacion, usuarioModificacion)
values
	('Admin','Admin Apellido','Admin','admin@admin.com','m5sfqJon/iqWluKjuJmyoA==','/images/usuarios/admin.png','Activado',1,'Activado',1,1,20200225144824,'bob',20050225144824,'bob'), /*Admin123 */
	('Belinda','Peregrín ','It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in','test3@test.com','WaHSuZR5qsntqo1C6pEaXQ==','/images/usuarios/belinda.png','Activado',2,'Activado',1,1,20200225144824,'bob',20200225144824,'bob'),
	('Emi','Yamada','All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200','test9@test.com','WaHSuZR5qsntqo1C6pEaXQ==','/images/usuarios/eimi.jpg','Activado',2,'Activado',1,1,20200225144824,'bob',20200225144824,'bob'),
	('Charlista1','Charlista1','All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200','test10@test.com','WaHSuZR5qsntqo1C6pEaXQ==','/images/usuarios/ana.jpg','Activado',2,'Activado',1,1,20200225144824,'bob',20200225144824,'bob'),
	('Charlista2','Charlista2','All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200','test11@test.com','WaHSuZR5qsntqo1C6pEaXQ==','/images/usuarios/1.jpg','Activado',2,'Activado',1,1,20200225144824,'bob',20200225144824,'bob'),
	('Kenzie','Rios','All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200','test12@test.com','WaHSuZR5qsntqo1C6pEaXQ==','/images/usuarios/kenzi.jpg','Activado',3,'Activado',1,1,20200225144824,'bob',20200225144824,'bob'),
	('Cliente1','Cliente1','All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200','test13@test.com','WaHSuZR5qsntqo1C6pEaXQ==','/images/usuarios/10.jpg','Activado',3,'Activado',1,1,20200225144824,'bob',20200225144824,'bob'),
	('Cliente2','Cliente2','All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200','test14@test.com','WaHSuZR5qsntqo1C6pEaXQ==','/images/usuarios/5.jpg','Activado',3,'Activado',1,1,20200225144824,'bob',20200225144824,'bob');


INSERT INTO tbcategoria(nombreCategoria, descripcionCategoria, imagenCategoria, fechaCreacion, usuarioCreacion, 
    fechaModificacion, usuarioModificacion)
values 
   ('Caficultura','actividad de producción y comercialización del café',"/images/categorias/1.png",20200225144824,'bob',20200225144824,'bob'),
   ('Barismo','Un barista es el profesional especializado en el café de alta calidad, que trabaja creando nuevas y diferentes bebidas basadas en él',"/images/categorias/2.png",20200225144824,'bob',20200225144824,'bob'),
   ('Catación','es la descripción y/o medición de características físicas y organolépticas de algún producto',"/images/categorias/1.png",20200225144824,'bob',20200225144824,'bob'),
   ('Tueste','es el tratamiento térmico al que se somete la semilla del cafeto para obtener un producto quebradizo',"/images/categorias/2.png",20200225144824,'bob',20200225144824,'bob'),
   ('Mercado','compra y venta del cafe',"/images/categorias/1.png",20200225144824,'bob',20200225144824,'bob'),
   ('Competencias','pvp de baristas',"/images/categorias/2.png",20200225144824,'bob',20200225144824,'bob'),
   ('Sub-productos del café','cafe y sus productos',"/images/categorias/1.png",20200225144824,'bob',20200225144824,'bob'),
   ('Historia','principios y actualidades del cafe',"/images/categorias/2.png",20200225144824,'bob',20200225144824,'bob');


INSERT INTO tbcharla(nombreCharla,descripcionCharla, nivelCharla, valoracionCharla, ImagenCharla, precioCharla, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion)
values
   ('Charla 1','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'Avanzado', 5,'/images/charlas/3.png',12000,20200225144824,'bob',20200225144824,'bob'),
   ('Historia del cafe','Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock', 'Principiante', 2.69,'/images/charlas/4.png',4700,20200225144824,'bob',20200225144824,'bob'),
   ('Tueste Basico','There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour', 'Principiante', 2.99,'/images/charlas/5.png',32000,20200225144824,'bob',20200225144824,'bob'),
   ('Cafe en el mundo','atin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable', 'Avanzado', 4.2,'/images/charlas/4.png',1800,20200225144824,'bob',20200225144824,'bob'),
   ('Competencia 1','Compentencias entre charlistas', 'Principiante', 2.6,'/images/charlas/2.jpg',2600,20050225144824,'bob',20050225144824,'bob'),
   ('Precios en latinoamerica','The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32', 'Principiante', 3.6,'/images/charlas/3.png',5.500,20200225144824,'bob',20200225144824,'bob'),
   ('Barismo intermedio','This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum', 'Intermedio', 3.2,'/images/charlas/4.png',6300,20200225144824,'bob',20200225144824,'bob'),
   ('Catacion avanzada','and going through the cites of the word in classical literature, discovered the undoubtable source.', 'Principiante', 4.5,'/images/charlas/5.png',7200,20200225144824,'bob',20200225144824,'bob'),
   ('Cafe en Costa Rica','Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search', 'Avanzado', 4.5,'/images/charlas/5.png',6250,20200225144824,'bob',20200225144824,'bob'),
   ('Caficultura','cultivando cafe', 'Intermedio', 4.6,'/images/charlas/4.png',7800,20200225144824,'bob',20200225144824,'bob');
   
   INSERT INTO tbcharlacategoria(idCharla,idCategoria)
values
   (1,1),
   (2,2),
   (3,4),
   (4,5),
   (5,5),
   (6,6),
   (7,7),
   (8,8),
   (9,1),
   (10,2);
   
   INSERT INTO tbvideo(linkVideo, nombreVideo, duracionVideo,ordenVideo, fechaCreacion,usuarioCreacion,fechaModificacion,usuarioModificacion)
values
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre1','3:05',1,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre2','5:25',2,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre3','5:25',3,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre4','5:25',4,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre5','5:25',5,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre6','5:25',1,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre7','5:25',2,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre8','5:25',1,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre9','5:25',2,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre10','5:25',3,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre11','5:25',1,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre12','5:25',2,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre13','5:25',1,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre14','5:25',2,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob'),
   ('https://player.vimeo.com/video/97243285?title=0&amp;byline=0&amp;portrait=0','Nombre15','5:25',3,CURRENT_TIMESTAMP,'Bob',CURRENT_TIMESTAMP,'Bob');
   
   INSERT INTO tbvideocharla(idVideo,idCharla)
values
   (1,1),
   (2,2),
   (3,3),
   (4,1),
   (5,1),
   (6,2),
   (7,2),
   (8,3),
   (9,3),
   (10,3),
   (11,4),
   (12,4),
   (13,10),
   (14,1),
   (15,1);
   
   INSERT INTO tbcharlacharlista (idCharla, idUsuario)
   values
		(1,2),
		(2,3),
		(3,4),
		(4,5),
		(5,2),
		(6,3),
		(7,4),
		(8,5),
		(9,2),
		(10,3);
        
INSERT INTO tbcharlausuario (idUsuario, idCharla, valoracionCharla, finalizado, fechaMatricula)
   values
   (6, 1, 0, "No", CURRENT_TIMESTAMP),
   (7, 2, 0, "No", CURRENT_TIMESTAMP),
   (8, 3, 0, "No", CURRENT_TIMESTAMP);
   
INSERT INTO tbReceta (nombreReceta, descripcionReceta, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion)
values
("Receta 1", "Receta 1 descripción", CURRENT_TIMESTAMP, "bob", CURRENT_TIMESTAMP, "bob"),
("Receta 2", "Receta 2 descripción", CURRENT_TIMESTAMP, "bob", CURRENT_TIMESTAMP, "bob"),
("Receta 3", "Receta 3 descripción", CURRENT_TIMESTAMP, "bob", CURRENT_TIMESTAMP, "bob");

INSERT INTO tbRecetaUsuario (idReceta, idUsuario)
values
(1, 6),
(2, 6),
(3, 8);