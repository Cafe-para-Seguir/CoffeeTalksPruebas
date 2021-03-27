CREATE SCHEMA `uncafeparaseguir` ;
USE uncafeparaseguir;

CREATE TABLE uncafeparaseguir.tbrol (
  idRol INT NOT NULL AUTO_INCREMENT,
  nombreRol VARCHAR(60) NOT NULL,
  PRIMARY KEY (idRol));

CREATE TABLE uncafeparaseguir.tbcategoria (
  idCategoria INT NOT NULL AUTO_INCREMENT,
  nombreCategoria VARCHAR(45) NOT NULL,
  descripcionCategoria VARCHAR(400) NULL,
  imagenCategoria VARCHAR(200) NOT NULL,
  fechaCreacion TIMESTAMP NOT NULL,
  usuarioCreacion VARCHAR(45) NOT NULL,
  fechaModificacion TIMESTAMP NOT NULL,
  usuarioModificacion VARCHAR(45) NOT NULL,
  PRIMARY KEY (idcategoria));

CREATE TABLE uncafeparaseguir.tbreceta (
  idReceta INT NOT NULL AUTO_INCREMENT,
  nombreReceta VARCHAR(60) NOT NULL,
  descripcionReceta VARCHAR(800) NOT NULL,
  fechaCreacion TIMESTAMP NOT NULL,
  usuarioCreacion VARCHAR(45) NOT NULL,
  fechaModificacion TIMESTAMP NOT NULL,
  usuarioModificacion VARCHAR(45) NOT NULL,
  PRIMARY KEY (idReceta));

CREATE TABLE uncafeparaseguir.tbcodigousuario (
  idCodigoUsuario INT NOT NULL AUTO_INCREMENT,
  correoUsuario VARCHAR(45) NOT NULL,
  codigo VARCHAR(8) NULL,
  tipoCodigo INT NULL,
  fechaCreacion TIMESTAMP NOT NULL,
  PRIMARY KEY (idCodigoUsuario),
  KEY (fechaCreacion));

CREATE TABLE uncafeparaseguir.tbusuario (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  nombreUsuario VARCHAR(45) NOT NULL,
  apellidosUsuario VARCHAR(70) NOT NULL,
  descripcionUsuario VARCHAR(200) NULL,
  correoUsuario VARCHAR(45) UNIQUE NOT NULL,
  claveUsuario VARCHAR(200) NOT NULL,
  imagenUsuario VARCHAR(100) NULL,
  opcionNotificacion VARCHAR(15) NULL,
  idRol INT NOT NULL,
  estadoUsuario VARCHAR(15) NOT NULL,
  validadoUsuario INT NOT NULL,
  valoracionCharlista DOUBLE,
  fechaCreacion TIMESTAMP NOT NULL,
  usuarioCreacion VARCHAR(45) NOT NULL,
  fechaModificacion TIMESTAMP NOT NULL,
  usuarioModificacion VARCHAR(45) NOT NULL,
  PRIMARY KEY (idUsuario),
  KEY(fechaCreacion),

  INDEX idUsuario_idx (idUsuario ASC),
  CONSTRAINT idRol
    FOREIGN KEY (idRol)
    REFERENCES uncafeparaseguir.tbrol (idRol)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE uncafeparaseguir.tbcharla (
  idCharla INT NOT NULL AUTO_INCREMENT,
  nombreCharla VARCHAR(70) NOT NULL,
  descripcionCharla VARCHAR(800) NOT NULL,
  nivelCharla VARCHAR(150) NOT NULL,
  valoracionCharla DOUBLE,
  imagenCharla VARCHAR(200) NOT NULL,
  precioCharla DOUBLE NOT NULL,
  fechaCreacion TIMESTAMP NOT NULL,
  usuarioCreacion VARCHAR(45) NOT NULL,
  fechaModificacion TIMESTAMP NOT NULL,
  usuarioModificacion VARCHAR(45) NOT NULL,
  PRIMARY KEY (idCharla));

CREATE TABLE uncafeparaseguir.tbvideo (
  idVideo INT NOT NULL AUTO_INCREMENT,
  linkVideo VARCHAR(300) NOT NULL,
  nombreVideo VARCHAR(300) NOT NULL,
  duracionVideo VARCHAR(30) NOT NULL,
  ordenVideo INT NOT NULL,
  fechaCreacion TIMESTAMP NOT NULL,
  usuarioCreacion VARCHAR(45) NOT NULL,
  fechaModificacion TIMESTAMP NOT NULL,
  usuarioModificacion VARCHAR(45) NOT NULL,
  PRIMARY KEY (idVideo));

CREATE TABLE uncafeparaseguir.tbforo (
  idForo INT NOT NULL AUTO_INCREMENT,
  idCharla INT NOT NULL,
  idUsuario INT NOT NULL,
  idComentario INT NULL,
  comentarioForo VARCHAR(200) NOT NULL,
  fechaComentario TIMESTAMP NOT NULL,
  PRIMARY KEY (idforo),
  INDEX idCharlaForo_idx (idCharla ASC),
  INDEX idUsuarioForo_idx (idUsuario ASC),
  CONSTRAINT idCharlaForo
    FOREIGN KEY (idCharla)
    REFERENCES uncafeparaseguir.tbcharla (idCharla)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT idUsuarioForo
    FOREIGN KEY (idUsuario)
    REFERENCES uncafeparaseguir.tbusuario (idUsuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE uncafeparaseguir.tbrecetausuario (
  idRecetaUsuario INT NOT NULL AUTO_INCREMENT,
  idReceta INT NULL,
  idUsuario INT NULL,
  PRIMARY KEY (idRecetaUsuario),
  INDEX idReceta_idx (idReceta ASC),
  INDEX idUsuario_idx (idUsuario ASC),
  CONSTRAINT idReceta
    FOREIGN KEY (idReceta)
    REFERENCES uncafeparaseguir.tbreceta (idReceta)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT idUsuario
    FOREIGN KEY (idUsuario)
    REFERENCES uncafeparaseguir.tbusuario (idUsuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE uncafeparaseguir.tbcharlacategoria (
  idCharlaCategoria INT NOT NULL AUTO_INCREMENT,
  idCharla INT NOT NULL,
  idCategoria INT NOT NULL,
  PRIMARY KEY (idCharlaCategoria),
  INDEX idCharla_idx (idCharla ASC),
  INDEX idCategoria_idx (idCategoria ASC),
  CONSTRAINT idCategoriaCharla1
    FOREIGN KEY (idCategoria)
    REFERENCES uncafeparaseguir.tbcategoria (idCategoria)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT idcharlaCategoria1
    FOREIGN KEY (idCharla)
    REFERENCES uncafeparaseguir.tbcharla (idCharla)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE uncafeparaseguir.tbcharlausuario (
  idCharlaUsuario INT NOT NULL AUTO_INCREMENT,
  idUsuario INT NOT NULL,
  idCharla INT NOT NULL,
  valoracionCharla INT NOT NULL,
  finalizado VARCHAR(5) NOT NULL,
  fechaMatricula TIMESTAMP NOT NULL,
  fechaFinalizacion TIMESTAMP NULL,
  PRIMARY KEY (idCharlaUsuario),
  INDEX idUsuario_idx (idUsuario ASC),
  INDEX idCharla_idx (idCharla ASC),
  CONSTRAINT idUsuario1
    FOREIGN KEY (idUsuario)
    REFERENCES uncafeparaseguir.tbusuario (idUsuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT idCharla
    FOREIGN KEY (idCharla)
    REFERENCES uncafeparaseguir.tbcharla (idCharla)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE uncafeparaseguir.tbcharlacharlista (
  idCharlaCharlista INT NOT NULL AUTO_INCREMENT,
  idCharla INT NOT NULL,
  idUsuario INT NOT NULL,
  PRIMARY KEY (idCharlaCharlista),
  INDEX idCharlaC_idx (idCharla ASC),
  INDEX idUsuarioC_idx (idUsuario ASC),
  CONSTRAINT idCharlaCharl
    FOREIGN KEY (idCharla)
    REFERENCES uncafeparaseguir.tbcharla (idCharla)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT idUsuarioCharl
    FOREIGN KEY (idUsuario)
    REFERENCES uncafeparaseguir.tbusuario (idUsuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE uncafeparaseguir.tbvideocharla (
  idVideoCharla INT NOT NULL AUTO_INCREMENT,
  idVideo INT NOT NULL,
  idCharla INT NOT NULL,
  PRIMARY KEY (idvideocharla),
  INDEX idVideo_idx (idVideo ASC),
  INDEX idCharlaV_idx (idCharla ASC),
  CONSTRAINT idVideoC
    FOREIGN KEY (idVideo)
    REFERENCES uncafeparaseguir.tbvideo (idVideo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT idCharlaV
    FOREIGN KEY (idCharla)
    REFERENCES uncafeparaseguir.tbcharla (idCharla)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE uncafeparaseguir.tbvideousuario (
  idvideousuario INT NOT NULL AUTO_INCREMENT,
  idusuario INT NOT NULL,
  idvideo INT NOT NULL,
  visualizado INT NOT NULL,
  PRIMARY KEY (idvideousuario),
  INDEX idvideousuario_idx (idusuario ASC),
  INDEX idvideousuario_idx1 (idvideo ASC),
  CONSTRAINT idusuariovideo
    FOREIGN KEY (idusuario)
    REFERENCES uncafeparaseguir.tbusuario (idUsuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT idvideousuario
    FOREIGN KEY (idvideo)
    REFERENCES uncafeparaseguir.tbvideo (idVideo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO tbrol (nombreRol)values 
  ('Administrador'),
  ('Charlista'),
  ('Cliente');

INSERT INTO tbusuario (nombreUsuario, apellidosUsuario, descripcionUsuario, correoUsuario, claveUsuario, imagenUsuario, opcionNotificacion, idRol, estadoUsuario, validadoUsuario, valoracionCharlista, fechaCreacion, usuarioCreacion, 
    fechaModificacion, usuarioModificacion)
values
	('Admin','Admin','Admin','admin@admin.com','m5sfqJon/iqWluKjuJmyoA==','/images/usuarios/admin.png','Activado',1,'Activado',1,1,NOW(),'Sistema',NOW(),'Sistema');/** Pass: Admin123*/

INSERT INTO tbcategoria(nombreCategoria, descripcionCategoria, imagenCategoria, fechaCreacion, usuarioCreacion, 
    fechaModificacion, usuarioModificacion)
values 
   ('Caficultura','actividad de producción y comercialización del café',"/images/categorias/1.png",NOW(),'Sistema',NOW(),'Sistema'),
   ('Barismo','Un barista es el profesional especializado en el café de alta calidad, que trabaja creando nuevas y diferentes bebidas basadas en él',"/images/categorias/2.png",NOW(),'Sistema',NOW(),'Sistema'),
   ('Catación','es la descripción y/o medición de características físicas y organolépticas de algún producto',"/images/categorias/1.png",NOW(),'Sistema',NOW(),'Sistema'),
   ('Tueste','es el tratamiento térmico al que se somete la semilla del cafeto para obtener un producto quebradizo',"/images/categorias/2.png",NOW(),'Sistema',NOW(),'Sistema'),
   ('Mercado','compra y venta del cafe',"/images/categorias/1.png",NOW(),'Sistema',NOW(),'Sistema'),
   ('Competencias','Competencias de baristas',"/images/categorias/2.png",NOW(),'Sistema',NOW(),'Sistema'),
   ('Sub-productos del café','cafe y sus productos',"/images/categorias/1.png",NOW(),'Sistema',NOW(),'Sistema'),
   ('Historia','principios y actualidades del cafe',"/images/categorias/2.png",NOW(),'Sistema',NOW(),'Sistema');