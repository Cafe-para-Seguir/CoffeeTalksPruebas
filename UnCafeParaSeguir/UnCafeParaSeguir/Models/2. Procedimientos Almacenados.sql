
use uncafeparaseguir;

/***********************************************************************************************************/
/************************************************* ROLES ***************************************************/
/***********************************************************************************************************/

		/* Ver Rol */
DELIMITER //
CREATE PROCEDURE sp_MostrarRoles()
BEGIN
  SELECT idRol, nombreRol FROM tbrol;
END //
DELIMITER ;

/***********************************************************************************************************/
/*********************************************** CATEGORIAS ************************************************/
/***********************************************************************************************************/

		/* Agregar, modificar y eliminar Categoria */
DELIMITER //
CREATE PROCEDURE sp_MantCategoria(pIdCategoria INT, pNombreCategoria varchar(200),pDescripcionCategoria varchar(200), pImagenCategoria varchar(200), pUsuarioCreacion varchar(200), pUsuarioModificacion varchar(200), pModo varchar(200))
BEGIN

DECLARE errno INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR' THEN 
	IF EXISTS (SELECT * FROM tbcategoria WHERE nombreCategoria = pNombreCategoria AND descripcionCategoria = pDescripcionCategoria) THEN 
		SELECT -1;
    ELSE
      start transaction;
            INSERT INTO tbcategoria (nombreCategoria, descripcionCategoria, imagenCategoria, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion) 
           VALUES (pNombreCategoria,pDescripcionCategoria, pImagenCategoria, CURRENT_TIMESTAMP, pUsuarioCreacion, CURRENT_TIMESTAMP, pUsuarioModificacion);
      select 1;
     commit work;
	END IF;
    
ELSEIF pModo = 'MODIFICAR' THEN
	start transaction;
	UPDATE tbcategoria SET nombreCategoria = pNombreCategoria, descripcionCategoria=pDescripcionCategoria, imagenCategoria=pImagenCategoria, fechaModificacion=CURRENT_TIMESTAMP, usuarioModificacion=pUsuarioModificacion WHERE idCategoria = pIdCategoria;
	select 2;	
	commit work;
    
ELSEIF pModo = 'ELIMINAR' THEN
IF EXISTS (SELECT * FROM tbcharlacategoria WHERE idCategoria = pIdCategoria) THEN 
		SELECT 39;
    ELSE
		start transaction;
		DELETE FROM tbcategoria WHERE idCategoria = pIdCategoria;
		select 3;
		commit work;
	END IF;
ELSE 
	select -1;		
END IF;
END//
DELIMITER ;

		/* Mostrar Categoria */	
DELIMITER //
CREATE PROCEDURE sp_MostrarCategoria()
BEGIN
  SELECT idCategoria, nombreCategoria, descripcionCategoria, imagenCategoria, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion FROM tbcategoria;
END //
DELIMITER ;

		/* Mostrar Categoria */	
DELIMITER //
CREATE PROCEDURE sp_MostrarCategoriaFiltrada(pIdCategoria INT)
BEGIN
  SELECT idCategoria, nombreCategoria, descripcionCategoria, imagenCategoria FROM tbcategoria WHERE idCategoria = pIdCategoria;
END //
DELIMITER ;

/***********************************************************************************************************/
/*********************************************** RECETAS ***************************************************/
/***********************************************************************************************************/

/* Agregar relacion de usuario con la receta */
DELIMITER //
CREATE PROCEDURE sp_RelacionUsuarioReceta(pIdUsuario INT)
BEGIN
	start transaction;
		INSERT INTO tbrecetausuario (idReceta, idUsuario) VALUES ( (SELECT MAX(idReceta) FROM tbReceta) , pIdUsuario );
		select 1;
	commit work;
END //
DELIMITER ;

/* Modifica relacion de usuario con la receta */
DELIMITER //
CREATE PROCEDURE sp_ModificarRelacionUsuarioReceta(pIdReceta INT, pIdUsuario INT)
BEGIN
	start transaction;
		UPDATE tbrecetausuario SET idUsuario = pIdUsuario WHERE idReceta = pIdReceta;
		select 1;
     commit work;
END //
DELIMITER ;

		/* Agregar, modificar y eliminar Recetas */
DELIMITER //
CREATE PROCEDURE sp_MantReceta(pNombreReceta varchar(200), pDescripcionReceta varchar(800), pIdReceta INT, pModo varchar(200), pIdUsuario INT, pUsuarioCreacion varchar(200), pUsuarioModificacion varchar(200) )
BEGIN

DECLARE errno INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR' THEN 
	IF EXISTS (SELECT idReceta FROM tbreceta WHERE nombreReceta = pNombreReceta AND descripcionReceta = pDescripcionReceta)  THEN 
		SELECT -1;
    ELSEIF ( ( SELECT count(u.idUsuario) FROM tbusuario u, tbrecetausuario ru WHERE ru.idUsuario = u.idUsuario AND u.idUsuario = pIdUsuario ) >= 3) THEN
		SELECT 49;
	ELSE
      start transaction;
            INSERT INTO tbreceta (nombreReceta, descripcionReceta, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion) 
			VALUES (pNombreReceta,pDescripcionReceta, CURRENT_TIMESTAMP, pUsuarioCreacion, CURRENT_TIMESTAMP, pUsuarioModificacion);
      select 1;
     commit work;
	END IF;

ELSEIF pModo = 'MODIFICAR' THEN
	
	IF ( ( SELECT idUsuario FROM tbrecetausuario WHERE idReceta = pIdReceta ) = pIdUsuario ) THEN 
		start transaction;
		UPDATE tbreceta SET nombreReceta = pNombreReceta, descripcionReceta=pDescripcionReceta, fechaModificacion=CURRENT_TIMESTAMP , usuarioModificacion=pUsuarioModificacion WHERE idReceta = pIdReceta ;
		select 2;
		commit work;
	ELSEIF( ( SELECT count(idReceta) FROM tbrecetausuario WHERE idUsuario = pIdUsuario )) >= 3 THEN
		select 49;
    ELSE
		start transaction;
		UPDATE tbreceta SET nombreReceta = pNombreReceta, descripcionReceta=pDescripcionReceta, fechaModificacion=CURRENT_TIMESTAMP , usuarioModificacion=pUsuarioModificacion WHERE idReceta = pIdReceta ;
		select 2;
		commit work;
	END IF;
    
ELSEIF pModo = 'ELIMINAR' THEN
    start transaction;
	DELETE FROM tbreceta WHERE idReceta = pIdReceta ;
    select 3;
	commit work;
ELSE 
	select -1;		
END IF;
END//
DELIMITER ;

	/* Mostrar Receta */	
DELIMITER //
CREATE PROCEDURE sp_MostrarReceta()
BEGIN
  SELECT idReceta, nombreReceta, descripcionReceta, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion FROM tbreceta;
END //
DELIMITER ;

		/* Mostrar Receta Filtrada*/	
DELIMITER //
CREATE PROCEDURE sp_MostrarRecetaFiltrada(pIdReceta int)
BEGIN
  SELECT idReceta, nombreReceta, descripcionReceta FROM tbreceta WHERE idReceta = pIdReceta;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_MostrarUsuarioXReceta(pIdReceta int)
BEGIN
	SELECT u.correoUsuario FROM tbusuario u, tbreceta r, tbrecetausuario ru WHERE r.idReceta = ru.idReceta AND u.idUsuario = ru.idUsuario AND r.idReceta = pIdReceta;
END //
DELIMITER ;

/***********************************************************************************************************/
/*********************************************** USUARIOS **************************************************/
/***********************************************************************************************************/

DELIMITER //
CREATE PROCEDURE sp_InicioSesion(pCorreoUsuario varchar(200), pClaveUsuario varchar(100)  )
BEGIN
  SELECT idUsuario, correoUsuario, claveUsuario, idRol, nombreUsuario, estadoUsuario, validadoUsuario  FROM tbusuario WHERE correoUsuario = pCorreoUsuario AND claveUsuario = pClaveUsuario;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_VerificarCorreo(pCorreoUsuario varchar(200))
BEGIN
  SELECT idUsuario, nombreUsuario, apellidosUsuario, correoUsuario, idRol, validadoUsuario FROM tbusuario WHERE correoUsuario = pCorreoUsuario;
END //
DELIMITER ;

	/* Agregar, modificar y eliminar Usuarios */
DELIMITER //
CREATE PROCEDURE sp_MantUsuario( pIdUsuario INT, pNombreUsuario varchar(200), pApellidosUsuario varchar(200), pDescripcionUsuario varchar(200), pCorreoUsuario varchar(200), 
pClaveUsuario varchar(100), pImagenUsuario varchar(100), pOpcionNotificacion varchar(200), pIdRol int, pEstadoUsuario varchar(200), pUsuarioCreacion varchar(200), pUsuarioModificacion varchar(200), pModo varchar(200))
BEGIN

DECLARE errno INT;
DECLARE idRespuesta INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR' THEN 
	IF EXISTS (SELECT * FROM tbusuario WHERE correoUsuario = pCorreoUsuario) THEN 
		SELECT -1000;
    ELSE 
      start transaction;
	  INSERT INTO tbusuario (nombreUsuario, apellidosUsuario, descripcionUsuario, correoUsuario, claveUsuario, imagenUsuario, opcionNotificacion, idRol, estadoUsuario, validadoUsuario, valoracionCharlista, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion)
	  VALUES (pNombreUsuario, pApellidosUsuario, pDescripcionUsuario, pCorreoUsuario, pClaveUsuario, "", "Activado", 3, "Activado", 1, valoracionCharlista, CURRENT_TIMESTAMP, pUsuarioCreacion, CURRENT_TIMESTAMP, pUsuarioModificacion);
      select 1;
     commit work;
	END IF;
    
ELSEIF pModo = 'MODIFICAR' THEN
	start transaction;
	UPDATE tbusuario SET nombreUsuario = pNombreUsuario, apellidosUsuario = pApellidosUsuario, descripcionUsuario= pDescripcionUsuario,
    imagenUsuario = pImagenUsuario, opcionNotificacion = pOpcionNotificacion, idRol = pIdRol, estadoUsuario = pEstadoUsuario, fechaModificacion=CURRENT_TIMESTAMP ,usuarioModificacion=pUsuarioModificacion WHERE idUsuario = pIdUsuario;
	select 1;
	commit work;
    
ELSEIF pModo = 'ELIMINAR' THEN
IF EXISTS (SELECT idUsuario FROM tbcharlacharlista WHERE idUsuario = pIdUsuario) THEN 
        SELECT 39;
    ELSEIF EXISTS (SELECT idUsuario FROM tbcharlausuario WHERE idUsuario = pIdUsuario) THEN 
        SELECT 40;
    ELSE
    start transaction;
    	loop_label:  LOOP
		set idRespuesta = (SELECT idForo FROM tbforo WHERE idUsuario = pIdUsuario limit 1);
    
		IF  (idRespuesta is null) THEN
			LEAVE  loop_label;
		ELSE
			DELETE FROM tbforo WHERE idForo = idRespuesta;
		END  IF;
	END LOOP;
        
    DELETE FROM tbusuario WHERE idUsuario = pIdUsuario ;
    select 3;
    commit work;
END IF;
ELSE 
	select -1;		
END IF;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_RegistroNuevoUsuario( pIdUsuario INT, pNombreUsuario varchar(200), pApellidosUsuario varchar(200), pCorreoUsuario varchar(200), 
pClaveUsuario varchar(100), pUsuarioCreacion varchar(200), pUsuarioModificacion varchar(200), pModo varchar(200))
BEGIN

DECLARE errno INT;
DECLARE idRespuesta INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR' THEN 
	IF EXISTS (SELECT * FROM tbusuario WHERE correoUsuario = pCorreoUsuario) THEN 
		SELECT -1000;
    ELSE 
      start transaction;
	  INSERT INTO tbusuario (nombreUsuario, apellidosUsuario, descripcionUsuario, correoUsuario, claveUsuario, imagenUsuario, opcionNotificacion, idRol, estadoUsuario, validadoUsuario, valoracionCharlista, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion)
	  VALUES (pNombreUsuario, pApellidosUsuario, "", pCorreoUsuario, pClaveUsuario, "", "Activado", 3, "Activado", 0, 0, CURRENT_TIMESTAMP, pUsuarioCreacion, CURRENT_TIMESTAMP, pUsuarioModificacion);
      select 1;
     commit work;
	END IF;
ELSE
	select -1;
END IF;
END//
DELIMITER ;

/* Cambio Clave */	
DELIMITER //
CREATE PROCEDURE sp_CambioClaveUsuario( pIdUsuario INT, pClaveUsuario varchar(100), pUsuarioModificacion varchar(200))
BEGIN
	start transaction;
	UPDATE tbusuario SET claveUsuario = pClaveUsuario, FechaModificacion=CURRENT_TIMESTAMP ,usuarioModificacion=pUsuarioModificacion  WHERE idUsuario = pIdUsuario;
	select 1;
	commit work;
END //
DELIMITER ;

/*validaCharlaComprada*/
DELIMITER //
CREATE PROCEDURE sp_validaCharlaComprada(pIdCharla INT, pIdUsuario INT)
BEGIN
IF EXISTS (SELECT idUsuario, idCharla FROM tbcharlausuario WHERE idCharla = pIdCharla AND idUsuario = pIdUsuario) THEN 
  SELECT 1;
  ELSE
  SELECT 2;
  commit work;
  END IF;
END //
DELIMITER ;

/* Mostrar Usuario */	
DELIMITER //
CREATE PROCEDURE sp_MostrarUsuario()
BEGIN
  SELECT idUsuario, nombreUsuario, apellidosUsuario ,descripcionUsuario, correoUsuario, claveUsuario, imagenUsuario, opcionNotificacion, idRol, estadoUsuario, 
  fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion FROM tbusuario WHERE idRol=3 AND validadoUsuario = 1;
END //
DELIMITER ;

/* Mostrar Charlista  */
DELIMITER //
CREATE PROCEDURE sp_MostrarCharlista()
BEGIN
  SELECT idUsuario, nombreUsuario, apellidosUsuario,descripcionUsuario, correoUsuario, claveUsuario, imagenUsuario, opcionNotificacion, idRol, estadoUsuario, valoracionCharlista, fechaCreacion, 
  usuarioCreacion, fechaModificacion, usuarioModificacion FROM tbusuario WHERE idRol=2;
END //
DELIMITER ;

/* Mostrar Charlista  */
DELIMITER //
CREATE PROCEDURE sp_MostrarCharlistaPorValoracion()
BEGIN
  SELECT idUsuario, nombreUsuario, apellidosUsuario, descripcionUsuario, imagenUsuario, valoracionCharlista FROM tbusuario WHERE idRol=2 ORDER BY valoracionCharlista DESC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_MostrarCharlistasRandom()
BEGIN
	SELECT idUsuario, nombreUsuario, apellidosUsuario, descripcionUsuario FROM tbusuario where idRol = 2
	ORDER BY RAND()
	LIMIT 6;
END //
DELIMITER ;

		/* Mostrar Usuario Filtrado*/	
DELIMITER //
CREATE PROCEDURE sp_MostrarUsuarioFiltrado(pIdUsuario INT)
BEGIN
  SELECT idUsuario, nombreUsuario, apellidosUsuario,descripcionUsuario, correoUsuario, claveUsuario, imagenUsuario, opcionNotificacion, idRol, estadoUsuario, valoracionCharlista, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion 
  FROM tbusuario WHERE idUsuario = pIdUsuario;
END //
DELIMITER ;

		/* Validacion Charlista*/	
DELIMITER //
CREATE PROCEDURE sp_ValoracionCharlista( pIdUsuario INT)
BEGIN
	SELECT valoracionCharlista FROM tbusuario WHERE idUsuario = pIdUsuario;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_ActualizarValoracionCharlista( pIdUsuario INT)
BEGIN
	start transaction;
		UPDATE tbusuario SET valoracionCharlista = ( SELECT SUM(c.valoracionCharla)/COUNT((SELECT COUNT(idUsuario) FROM tbcharlacharlista where idUsuario = pIdUsuario)) 
		FROM tbcharla c, tbcharlacharlista cc WHERE c.idCharla = cc.idCharla 
		AND cc.idUsuario = pIdUsuario ) WHERE idUsuario = pIdUsuario;
		select 1;
    commit work;
END //
DELIMITER ;

/***********************************************************************************************************/
/******************************************** ADMINISTRADOR ************************************************/
/***********************************************************************************************************/

/* Agregar, modificar y eliminar Administradores */
DELIMITER //
CREATE PROCEDURE sp_MantAdmin( pIdUsuario INT, pNombreUsuario varchar(200), pApellidosUsuario varchar(200), pDescripcionUsuario varchar(200), pCorreoUsuario varchar(200), 
pClaveUsuario varchar(100), pImagenUsuario varchar(100), pOpcionNotificacion varchar(200), pIdRol int, pEstadoUsuario varchar(200), pUsuarioCreacion varchar(200), pUsuarioModificacion varchar(200), pModo varchar(200))
BEGIN

DECLARE errno INT;
DECLARE idRespuesta INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR_ADMIN' THEN 
	IF EXISTS (SELECT * FROM tbusuario WHERE correoUsuario = pCorreoUsuario) THEN 
		SELECT -1000;
    ELSE
      start transaction;
	  INSERT INTO tbusuario (nombreUsuario, apellidosUsuario, descripcionUsuario, correoUsuario, claveUsuario, imagenUsuario, opcionNotificacion, idRol, estadoUsuario, validadoUsuario, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion)
	  VALUES (pNombreUsuario, pApellidosUsuario, pDescripcionUsuario, pCorreoUsuario, pClaveUsuario, "", "Activado", 1, "Activado",0, CURRENT_TIMESTAMP, pUsuarioCreacion, CURRENT_TIMESTAMP, pUsuarioModificacion);
      select 1;
     commit work;
	END IF;
    
ELSEIF pModo = 'MODIFICAR_ADMIN' THEN
	start transaction;
	UPDATE tbusuario SET nombreUsuario = pNombreUsuario, apellidosUsuario = pApellidosUsuario, descripcionUsuario= pDescripcionUsuario,
    imagenUsuario = pImagenUsuario, opcionNotificacion = pOpcionNotificacion, estadoUsuario = pEstadoUsuario, fechaModificacion=CURRENT_TIMESTAMP, usuarioModificacion=pUsuarioModificacion  WHERE idUsuario = pIdUsuario;
	select 2;
	commit work;
    
ELSEIF pModo = 'ELIMINAR_ADMIN' THEN
    start transaction;
    	loop_label:  LOOP
		set idRespuesta = (SELECT idForo FROM tbforo WHERE idUsuario = pIdUsuario limit 1);
    
		IF  (idRespuesta is null) THEN
			LEAVE  loop_label;
		ELSE
			DELETE FROM tbforo WHERE idForo = idRespuesta;
		END  IF;
	END LOOP;
        
     DELETE FROM tbusuario WHERE idUsuario = pIdUsuario ;
    select 3;
	commit work;

ELSE 
	select -1;		
END IF;
END//
DELIMITER ;

/* Mostrar Administrador*/	
DELIMITER //
CREATE PROCEDURE sp_MostrarAdministrador()
BEGIN
  SELECT idUsuario, nombreUsuario, apellidosUsuario ,descripcionUsuario, correoUsuario, claveUsuario, imagenUsuario, opcionNotificacion, idRol, estadoUsuario, 
  fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion FROM tbusuario WHERE idRol=1 AND idUsuario > 1;
END //
DELIMITER ;

/***********************************************************************************************************/
/********************************************* RECETAS POR USUARIO *****************************************/
/***********************************************************************************************************/

/* Agregar, modificar y eliminar RecetaUsuario */
DELIMITER //
CREATE PROCEDURE sp_MantRecetaUsuario(pIdReceta INT, pIdUsuario INT, pIdRecetaUsuario INT, pModo varchar(200))
BEGIN

DECLARE errno INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;


IF pModo = 'AGREGAR' THEN 
	IF EXISTS (SELECT * FROM tbrecetausuario WHERE idRecetaUsuario = pIdRecetaUsuario) THEN 
		SELECT -1;
    ELSE
      start transaction;
            INSERT INTO tbrecetausuario (idReceta, idUsuario)
			VALUES (pIdReceta, pIdUsuario);
      select 1;
     commit work;
	END IF;
    
ELSEIF pModo = 'MODIFICAR' THEN
	start transaction;
	UPDATE tbrecetausuario SET idReceta = pIdReceta, idUsuario = pIdUsuario WHERE idRecetaUsuario = pIdRecetaUsuario;
	select 1;
    commit work;

ELSEIF pModo = 'ELIMINARTODO' THEN /*elimina todas las recetas*/
	start transaction;
	DELETE FROM tbrecetausuario WHERE idUsuario = pIdUsuario;
	select 1;
    commit work;
    
ELSEIF pModo = 'ELIMINAR' THEN
    start transaction;
	DELETE FROM tbrecetausuario WHERE idRecetaUsuario = pIdRecetaUsuario;
    select 1;
    commit work;

ELSE 
	select -1;		
END IF;
END//
DELIMITER ;

		/* Mostrar RecetaUsuario */	

/* Mostrar todas las Recetas con detalles del Usuario*/
DELIMITER //
CREATE PROCEDURE sp_MostrarRecetaUsuario()
BEGIN
    SELECT r.idReceta, r.nombreReceta, r.descripcionReceta, u.nombreUsuario, u.apellidosUsuario
    FROM tbreceta r, tbrecetausuario ru, tbusuario u WHERE ru.idReceta = r.idReceta AND u.idUsuario = ru.idUsuario;
END //
DELIMITER ;

		/* Mostrar RecetaUsuario */	
DELIMITER //
CREATE PROCEDURE sp_MostrarRecetaUsuarioFiltrado(pIdUsuario INT)
BEGIN
  SELECT ru.idRecetaUsuario, ru.idReceta, re.nombreReceta, re.descripcionReceta, ru.idUsuario
  FROM tbrecetausuario ru, tbusuario us, tbreceta re WHERE ru.idReceta = re.idReceta AND ru.idUsuario = us.idUsuario AND ru.idUsuario = pIdUsuario;
END //
DELIMITER ;

/***********************************************************************************************************/
/************************************************ CHARLAS **************************************************/
/***********************************************************************************************************/

/* Agregar, modificar y eliminar Charlas */
DELIMITER //
CREATE PROCEDURE sp_MantCharla(pNombreCharla VARCHAR(200), pDescripcionCharla VARCHAR(300), pNivelCharla VARCHAR(300), pImagenCharla VARCHAR(300), pPrecioCharla DOUBLE, pUsuarioCreacion varchar(200), pUsuarioModificacion varchar(200), pIdCharla INT, pModo varchar(200))
BEGIN

DECLARE errno INT;
DECLARE idRespuesta INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR' THEN 
	IF EXISTS (SELECT * FROM tbcharla WHERE nombreCharla = pNombreCharla AND descripcionCharla = pDescripcionCharla and idCharla = pIdCharla) THEN 
		SELECT -1;
    ELSE
      start transaction;
            INSERT INTO tbcharla (nombreCharla, descripcionCharla, nivelCharla, valoracionCharla, imagenCharla, precioCharla, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion)
			VALUES (pNombreCharla,pDescripcionCharla,pNivelCharla,0,pImagenCharla,pPrecioCharla,CURRENT_TIMESTAMP ,pUsuarioCreacion,CURRENT_TIMESTAMP ,pUsuarioModificacion);
      select 1;
     commit work;
	END IF;
    
ELSEIF pModo = 'MODIFICAR' THEN
	start transaction;
		UPDATE tbcharla SET nombreCharla = pNombreCharla, descripcionCharla = pDescripcionCharla, nivelCharla=pNivelCharla, imagenCharla=pImagenCharla, precioCharla = pPrecioCharla, fechaModificacion=CURRENT_TIMESTAMP WHERE idCharla = pIdCharla;
	select 1;
    commit work;
    
ELSEIF pModo = 'ELIMINAR' THEN

	loop_label:  LOOP
		set idRespuesta = (SELECT idForo FROM tbforo WHERE idCharla = pIdCharla limit 1);
    
		IF  (idRespuesta is null) THEN
			LEAVE  loop_label;
		ELSE
			DELETE FROM tbforo WHERE idForo = idRespuesta;
		END  IF;
	END LOOP;
    
    DELETE FROM tbcharla WHERE idCharla = pIdCharla ;
    select 1;
	commit work;

ELSE 
	select -1;		
END IF;
END//
DELIMITER ;

/* Mostrar Charla en Ver Charlas */	
DELIMITER //
CREATE PROCEDURE sp_MostrarCharla()
BEGIN
  SELECT c.idCharla, c.nombreCharla, c.descripcionCharla, c.nivelCharla, c.valoracionCharla, c.imagenCharla, c.precioCharla, c.fechaCreacion, c.usuarioCreacion, c.fechaModificacion, 
  c.usuarioModificacion, u.nombreUsuario, cat.nombreCategoria, (SELECT COUNT(vc.idCharla) FROM tbvideocharla vc, tbvideo v, tbcharla c
    WHERE vc.idVideo = v.idVideo AND c.idCharla = vc.idCharla AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla group by vc.idCharla ) AS cantVideos
  FROM tbcharla c, tbusuario u, tbcharlacharlista cc, tbcategoria cat, tbcharlacategoria chcat
  WHERE c.idCharla = cc.idCharla AND u.idUsuario = cc.idUsuario AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla AND (SELECT COUNT(vc.idCharla) FROM tbvideocharla vc, tbvideo v, tbcharla c
    WHERE vc.idVideo = v.idVideo AND c.idCharla = vc.idCharla AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla group by vc.idCharla ) > 0 ;
END //
DELIMITER ;

/* Mostrar Charla en Admin */	
DELIMITER //
CREATE PROCEDURE sp_MostrarCharlaAdmin()
BEGIN
  SELECT c.idCharla, c.nombreCharla, c.descripcionCharla, c.nivelCharla, c.valoracionCharla, c.imagenCharla, c.precioCharla, c.fechaCreacion, c.usuarioCreacion, c.fechaModificacion, 
  c.usuarioModificacion, u.nombreUsuario, cat.nombreCategoria, (SELECT COUNT(vc.idCharla) FROM tbvideocharla vc, tbvideo v, tbcharla c
    WHERE vc.idVideo = v.idVideo AND c.idCharla = vc.idCharla AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla group by vc.idCharla ) AS cantVideos
  FROM tbcharla c, tbusuario u, tbcharlacharlista cc, tbcategoria cat, tbcharlacategoria chcat
  WHERE c.idCharla = cc.idCharla AND u.idUsuario = cc.idUsuario AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla ;
END //
DELIMITER ;

/* Mostrar Charla Filtrada */
DELIMITER //
CREATE PROCEDURE sp_MostrarCharlaFiltrada(pIdCharla INT)
BEGIN
    SELECT c.idCharla, c.nombreCharla, c.descripcionCharla, c.nivelCharla, c.valoracionCharla, c.imagenCharla, c.precioCharla, c.fechaCreacion, c.usuarioCreacion, c.fechaModificacion, c.usuarioModificacion, u.nombreUsuario, u.apellidosUsuario, u.descripcionUsuario, cat.nombreCategoria, 
    u.idUsuario, cat.idCategoria, u.correoUsuario, u.imagenUsuario
    FROM tbcharla c, tbusuario u, tbcharlacharlista cc, tbcategoria cat, tbcharlacategoria chcat
    WHERE c.idCharla = cc.idCharla AND u.idUsuario = cc.idUsuario AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla AND c.idCharla = pIdCharla;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_MostrarCharlaReciente()
BEGIN
  SELECT c.idCharla, c.nombreCharla, c.descripcionCharla, c.valoracionCharla, c.imagenCharla, c.precioCharla, c.fechaCreacion, c.usuarioCreacion, c.fechaModificacion, c.usuarioModificacion, u.nombreUsuario, cat.nombreCategoria
  FROM tbcharla c, tbusuario u, tbcharlacharlista cc, tbcategoria cat, tbcharlacategoria chcat
  WHERE c.idCharla = cc.idCharla AND u.idUsuario = cc.idUsuario AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla AND (SELECT COUNT(vc.idCharla) FROM tbvideocharla vc, tbvideo v, tbcharla c
    WHERE vc.idVideo = v.idVideo AND c.idCharla = vc.idCharla AND chcat.idCharla = c.idCharla group by vc.idCharla ) > 0  ORDER BY c.fechaCreacion DESC LIMIT 3;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_MostrarCharlaMV()
BEGIN
  SELECT c.idCharla, c.nombreCharla, c.descripcionCharla, c.nivelCharla, c.valoracionCharla, c.imagenCharla, c.precioCharla, c.fechaCreacion, c.usuarioCreacion, c.fechaModificacion, c.usuarioModificacion, u.nombreUsuario, u.apellidosUsuario, cat.nombreCategoria
  FROM tbcharla c, tbusuario u, tbcharlacharlista cc, tbcategoria cat, tbcharlacategoria chcat
  WHERE c.idCharla = cc.idCharla AND u.idUsuario = cc.idUsuario AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla ORDER BY  c.valoracionCharla DESC LIMIT 4;
END //
DELIMITER ;

/* Actualiza campo valor de charla */
DELIMITER //
CREATE PROCEDURE sp_ActualizarValoracionCharla(pIdCharla INT, pValoracionCharla DOUBLE)
BEGIN
start transaction;
		UPDATE tbcharla SET valoracionCharla = pValoracionCharla WHERE idCharla = pIdCharla;
	select 1;
    commit work;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_validaDuenoCharla(pIdCharla INT, pIdUsuario INT)
BEGIN
IF EXISTS (SELECT idUsuario, idCharla FROM tbcharlacharlista WHERE idCharla = pIdCharla AND idUsuario = pIdUsuario) THEN 
  SELECT 1;
  ELSE
  SELECT 2;
  commit work;
  END IF;
END //
DELIMITER ;

/***********************************************************************************************************/
/******************************************* CHARLA POR USUARIOS *******************************************/
/***********************************************************************************************************/

/* Agregar, modificar y eliminar Charlas Por Usuarios */
DELIMITER //
CREATE PROCEDURE sp_RealizarCompra( pIdUsuario INT, pIdCharla INT )
BEGIN

DECLARE errno INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

start transaction;
	INSERT INTO tbcharlausuario (idUsuario, idCharla, valoracionCharla, finalizado, fechaMatricula)
	VALUES (pIdUsuario, pIdCharla, 0, "No", CURRENT_TIMESTAMP);
select 1;
commit work;
END//
DELIMITER ;
call sp_RealizarCompra(13,18)
		/* Mostrar Charla Usuario Filtrado */	
DELIMITER //
CREATE PROCEDURE sp_MostrarCharlaUsuarioFiltrado(pIdUsuario INT)
BEGIN
  SELECT cu.idCharlaUsuario, cu.idUsuario, us.nombreUsuario, us.apellidosUsuario, cu.idCharla, ch.nombreCharla, ch.imagenCharla, ch.valoracionCharla, cu.finalizado, cu.fechaMatricula, cu.fechaFinalizacion 
  FROM tbcharlausuario cu, tbcharla ch, tbusuario us WHERE cu.idCharla = ch.idCharla AND cu.idUsuario = us.idUsuario AND us.idUsuario = pIdUsuario;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_ValorarCharla( pIdUsuario INT, pIdCharla INT, pValoracionCharla INT)
BEGIN
	start transaction;
		UPDATE tbcharlausuario SET valoracionCharla = pValoracionCharla WHERE idUsuario = pidUsuario AND idCharla = pIdCharla;
		select 1;
	commit work;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_ValoracionTotal( pIdCharla INT )
BEGIN
	SELECT SUM(valoracionCharla)/COUNT(idCharla) AS totalValor FROM tbcharlausuario WHERE idCharla = pIdCharla;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_ValoracionUsuario( pIdUsuario INT, pIdCharla INT )
BEGIN
	SELECT valoracionCharla FROM tbcharlausuario WHERE idUsuario = pIdUsuario AND idCharla = pIdCharla;
END //
DELIMITER ;

/***********************************************************************************************************/
/********************************************* CHARLA POR CATEGORIA ****************************************/
/***********************************************************************************************************/

/* Agregar, modificar y eliminar Charlas por categoruas*/
DELIMITER //
CREATE PROCEDURE sp_MantCharlaCategoria(pIdCharla INT, pIdCategoria INT, pModo varchar(200))
BEGIN

DECLARE errno INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;
IF pModo = 'AGREGAR' THEN 
      start transaction;
            INSERT INTO tbcharlacategoria (idCharla, idCategoria)
			VALUES ((SELECT MAX(idCharla) FROM tbcharla), pidCategoria);
      select 1;
     commit work;
    
ELSEIF pModo = 'MODIFICAR' THEN
	start transaction;
	UPDATE tbcharlacategoria SET idCategoria = pIdCategoria WHERE idCharla = pIdCharla;
	select 1;
    commit work;
ELSEIF pModo = 'ELIMINAR' THEN
    start transaction;
	DELETE FROM tbcharlacategoria WHERE idCharla = pIdCharla;
    select 1;
	commit work;
ELSE 
	select -1;		
END IF;
END//
DELIMITER ;

	/* Mostrar Charla Categoria */	
DELIMITER //
CREATE PROCEDURE sp_MostrarCharlaCategoria()
BEGIN
  SELECT cc.idCharlaCategoria, ch.idCharla, ch.nombreCharla, ca.idCategoria, ca.nombreCategoria  
  FROM tbcharlacategoria cc, tbcharla ch, tbcategoria ca  WHERE cc.idCharla = ch.idCharla AND cc.idCategoria = ca.idCategoria;
END //
DELIMITER ;
 
		/* Mostrar Charla Categoria Filtrado */	
DELIMITER //
CREATE PROCEDURE sp_MostrarCharlaCategoriaFiltrado(pIdCategoria INT)
BEGIN
  SELECT cc.idCharlaCategoria, ch.idCharla, ch.nombreCharla, ca.idCategoria, ca.nombreCategoria  
  FROM tbcharlacategoria cc, tbcharla ch, tbcategoria ca  WHERE cc.idCharla = ch.idCharla AND cc.idCategoria = ca.idCategoria AND cc.idCategoria = pIdCategoria;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_MostrarCharlaFiltradaPorCategoria(pIdCategoria INT)
BEGIN

SELECT c.idCharla, c.nombreCharla, c.descripcionCharla, c.valoracionCharla, c.nivelCharla, c.imagenCharla, c.precioCharla, c.fechaCreacion, c.usuarioCreacion, c.fechaModificacion, c.usuarioModificacion, u.nombreUsuario, cat.nombreCategoria,
    u.idUsuario, cat.idCategoria, u.correoUsuario, (SELECT COUNT(vc.idCharla) FROM tbvideocharla vc, tbvideo v, tbcharla c
    WHERE vc.idVideo = v.idVideo AND c.idCharla = vc.idCharla AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla AND cat.idCategoria = pIdCategoria group by vc.idCharla ) AS cantVideos
    FROM tbcharla c, tbusuario u, tbcharlacharlista cc, tbcategoria cat, tbcharlacategoria chcat
    WHERE c.idCharla = cc.idCharla AND u.idUsuario = cc.idUsuario AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla AND cat.idCategoria = pIdCategoria AND (SELECT COUNT(vc.idCharla) FROM tbvideocharla vc, tbvideo v, tbcharla c
    WHERE vc.idVideo = v.idVideo AND c.idCharla = vc.idCharla AND cat.idCategoria = chcat.idCategoria AND chcat.idCharla = c.idCharla AND cat.idCategoria = pIdCategoria group by vc.idCharla ) >0;
   
   END //
DELIMITER ;

/***********************************************************************************************************/
/************************************************* VIDEOS **************************************************/
/***********************************************************************************************************/

/* Agregar, modificar y eliminar Videos*/
DELIMITER //
CREATE PROCEDURE sp_MantVideo(pIdVideo INT, pLinkVideo VARCHAR(200), pNombreVideo VARCHAR(200), pDuracionVideo VARCHAR(200), pOrdenVideo INT, pUsuarioCreacion varchar(200), pUsuarioModificacion varchar(200), pModo varchar(200))
BEGIN

DECLARE errno INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR' THEN 
	IF EXISTS (SELECT * FROM tbvideo WHERE idVideo = pIdVideo) THEN 
		SELECT -1;
    ELSE
      start transaction;
            INSERT INTO tbvideo (linkVideo, nombreVideo, duracionVideo, ordenVideo, fechaCreacion, usuarioCreacion, fechaModificacion, usuarioModificacion) 
            VALUES (pLinkVideo, pNombreVideo, pDuracionVideo, pOrdenVideo, CURRENT_TIMESTAMP, pUsuarioCreacion,CURRENT_TIMESTAMP, pUsuarioModificacion);
      select 1;
     commit work;
	END IF;
    
ELSEIF pModo = 'MODIFICAR' THEN
	start transaction;
	UPDATE tbvideo SET linkVideo = pLinkVideo, nombreVideo=pNombreVideo, duracionVideo = pDuracionVideo, ordenVideo=pOrdenVideo, fechaModificacion=CURRENT_TIMESTAMP, usuarioModificacion=pUsuarioModificacion
    WHERE idVideo = pIdVideo;
	select 1;
    commit work;
ELSEIF pModo = 'ELIMINAR' THEN
    start transaction;
	DELETE FROM tbvideo WHERE idVideo = pIdVideo;
    select 1;
	commit work;
ELSE 
	select -1;		
END IF;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_validaOrdenVideoModificar(pIdVideo INT, pOrdenVideo INT )
BEGIN
	IF EXISTS (select idVideo from tbvideo where idVideo = pIdVideo and ordenVideo = pOrdenVideo) THEN
		select 1;
	ElSE
		select 0;
END IF;
 END //
DELIMITER ;

/* Mostrar Video */	
DELIMITER //
CREATE PROCEDURE sp_MostrarVideo()
BEGIN
  SELECT v.idVideo, v.linkVideo, v.nombreVideo, v.duracionVideo, v.ordenVideo, v.fechaCreacion, v.usuarioCreacion, v.fechaModificacion, v.usuarioModificacion, c.idCharla, c.nombreCharla
  FROM tbvideo v, tbcharla c, tbvideocharla vc
  WHERE v.idVideo = vc.idVideo AND c.idCharla = vc.idCharla;
END //
DELIMITER ;

		/* Mostrar Video Filtrado */	
DELIMITER //
CREATE PROCEDURE sp_MostrarVideoFiltrado(pIdVideo INT)
BEGIN
  SELECT v.idVideo, v.linkVideo, v.duracionVideo, v.ordenVideo, v.nombreVideo, c.fechaCreacion, c.usuarioCreacion, c.fechaModificacion, c.usuarioModificacion, c.idCharla, c.nombreCharla
  FROM tbvideo v, tbcharla c, tbvideocharla vc
  WHERE v.idVideo = vc.idVideo AND c.idCharla = vc.idCharla AND v.idVideo = pIdVideo;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_validaOrdenVideo(pIdCharla INT, pOrdenVideo INT )
BEGIN
	IF EXISTS (SELECT v.ordenVideo FROM tbvideo v, tbcharla c, tbvideocharla vc WHERE v.idVideo = vc.idVideo AND c.idCharla = vc.idCharla AND c.idCharla = pIdCharla AND v.ordenVideo = pOrdenVideo) THEN
		select -1;
	ElSE
		select 1;
END IF;
 END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_MostrarVideoID(pIdVideo INT)
BEGIN
	SELECT * FROM tbvideo WHERE idVideo = pIdVideo;
 END //
DELIMITER ;

/***********************************************************************************************************/
/********************************************* VIDEO POR CHARLAS *******************************************/
/***********************************************************************************************************/

/* Agregar, modificar y eliminar VideoCharlas*/
DELIMITER //
CREATE PROCEDURE sp_MantVideoCharla(pIdVideo INT, pIdCharla INT, pModo varchar(200))
BEGIN

DECLARE errno INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR' THEN 
      start transaction;
            INSERT INTO tbvideocharla (idVideo, idCharla)
			VALUES ((SELECT MAX(idVideo) FROM tbVideo), pIdCharla);
      select 1;
     commit work;
    
ELSEIF pModo = 'MODIFICAR' THEN
	start transaction;
	UPDATE tbvideocharla SET idVideo = pIdVideo, idCharla = pIdCharla WHERE idVideo = pIdVideo;
	select 1;
	commit work;
    
ELSEIF pModo = 'ELIMINAR' THEN
    start transaction;
	DELETE FROM tbvideocharla WHERE idVideo = pIdVideo;
    select 1;
	commit work;
ELSE 
	select -1;		
END IF;
END//
DELIMITER ;

/* Mostrar Charla Categoria */	
DELIMITER //
CREATE PROCEDURE sp_MostrarVideoCharla()
BEGIN
  SELECT vc.idvideocharla, vc.idVideo, vi.linkVideo, vc.idCharla, ch.nombreCharla
  FROM tbvideocharla vc, tbvideo vi, tbcharla ch WHERE vc.idVideo = vi.idVideo AND vc.idCharla = ch.idCharla;
END //
DELIMITER ;
 
/* Mostrar Video Charla Filtrado */	
DELIMITER //
CREATE PROCEDURE sp_MostrarVideoCharlaFiltrado(pIdCharla int)
BEGIN
  SELECT vc.idvideocharla, vc.idVideo, vi.nombreVideo, vi.duracionVideo, vi.ordenVideo, vi.linkVideo, vc.idCharla, ch.nombreCharla
  FROM tbvideocharla vc, tbvideo vi, tbcharla ch WHERE vc.idVideo = vi.idVideo AND vc.idCharla = ch.idCharla AND ch.idCharla = pidCharla ORDER BY vi.ordenVideo;
END //
DELIMITER ;

/* Mostrar Video Charla Filtrado Visualizado*/	
DELIMITER //
CREATE PROCEDURE sp_MostrarVideoCharlaFiltradoVisualizado(pIdCharla int, pIdUsuario int)
BEGIN
  SELECT vc.idvideocharla, vc.idVideo, vi.nombreVideo, vi.duracionVideo, vi.ordenVideo, vi.linkVideo, vc.idCharla, ch.nombreCharla, vu.visualizado
  FROM tbvideocharla vc, tbvideo vi, tbcharla ch, tbvideousuario vu WHERE vc.idVideo = vi.idVideo AND vc.idCharla = ch.idCharla AND ch.idCharla = pIdCharla AND vu.idVideo = vi.idVideo AND vu.idusuario = pIdUsuario
  ORDER BY vi.ordenVideo;
END //
DELIMITER ;
/***********************************************************************************************************/
/****************************************** CHARLA CHARLISTA ***********************************************/
/***********************************************************************************************************/

/* Agregar, modificar y eliminar Charlas Por Usuarios */
DELIMITER //
CREATE PROCEDURE sp_MantCharlaCharlista(pIdCharla INT, pIdUsuario INT, pModo varchar(200))
BEGIN

DECLARE errno INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR' THEN 
      start transaction;
            INSERT INTO tbcharlacharlista (idCharla, idUsuario)
			VALUES ((SELECT MAX(idCharla) FROM tbcharla), pIdUsuario);
      select 1;
     commit work;
     
ELSEIF pModo = 'MODIFICAR' THEN
	start transaction;
	UPDATE tbcharlacharlista SET idUsuario = pIdUsuario WHERE idCharla = pIdCharla;
	select 1;
    commit work;
ELSEIF pModo = 'ELIMINAR' THEN
    start transaction;
	DELETE FROM tbcharlacharlista WHERE idCharla = pIdCharla;
    select 1;
	commit work;
ELSE 
	select -1;		
END IF;
END//
DELIMITER ;
 
		/* Mostrar Charla Usuario Filtrado */	
DELIMITER //
CREATE PROCEDURE sp_MostrarCharlaCharlistaFiltrado(pIdUsuario INT)
BEGIN
  SELECT cc.idCharlaCharlista, us.idUsuario, us.nombreUsuario, us.apellidosUsuario, c.idCharla, c.nombreCharla, c.nivelCharla, c.imagenCharla, c.valoracionCharla
  FROM tbcharlacharlista cc, tbcharla c, tbusuario us WHERE cc.idCharla = c.idCharla AND cc.idUsuario = us.idUsuario AND us.idUsuario = pIdUsuario;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_MostrarCharlasRandom(pLimite INT, pIdUsuario INT)
BEGIN
    SELECT c.idCharla, c.nombreCharla, c.imagenCharla, c.valoracionCharla FROM tbcharla c, tbusuario u, tbcharlacharlista cc where c.idCharla = cc.idCharla AND u.idUsuario = cc.idUsuario AND u.idUsuario = pIdUsuario
    ORDER BY RAND()
    LIMIT pLimite;
END //
DELIMITER ;

/***********************************************************************************************************/
/************************************************* FORO ****************************************************/
/***********************************************************************************************************/

/* Agregar y eliminar foro */
DELIMITER //
CREATE PROCEDURE sp_MantForo( pModo varchar(200), pIdForo INT, pIdCharla INT, pIdUsuario INT, pIdComentario INT, pComentarioForo varchar(200) )
BEGIN

DECLARE errno INT;
DECLARE idRespuesta INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR' THEN 
      start transaction;
            INSERT INTO tbforo (idCharla, idUsuario, idComentario, comentarioForo, fechaComentario)
			VALUES (pIdCharla, pIdUsuario, pIdComentario, pComentarioForo, CURRENT_TIMESTAMP);
      select 1;
     commit work;

ELSEIF pModo = 'ELIMINAR' THEN
    start transaction;

    loop_label:  LOOP
    set idRespuesta = (SELECT idForo FROM tbforo WHERE idComentario = pIdForo limit 1);
    
		IF  (idRespuesta is null) THEN
			LEAVE  loop_label;
		ELSE
			DELETE FROM tbforo WHERE idForo = idRespuesta;
		END  IF;
	END LOOP;
    DELETE FROM tbforo WHERE idForo = pIdForo;
	select 3;
	commit work;
ELSE 
	select -1;		
END IF;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_MostrarForoComentarios(pIdCharla INT)
BEGIN

    SELECT f.idForo, c.idCharla, c.nombreCharla, u.idUsuario, u.nombreUsuario, u.apellidosUsuario, u.idRol, f.idComentario, f.comentarioForo, f.fechaComentario, 
    ( SELECT COUNT(idComentario) FROM tbforo WHERE idComentario = (SELECT f.idForo FROM tbforo WHERE idCharla = pIdCharla AND idComentario = 0 limit 1) ) AS cantRespuesta 
    FROM tbcharla c, tbusuario u, tbforo f 
    WHERE c.idCharla = f.idCharla AND u.idUsuario = f.idUsuario AND f.idCharla = pIdCharla AND idComentario = 0 ORDER BY f.fechaComentario DESC;

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_MostrarForoComentariosRespuestas(pIdForo INT)
BEGIN
    SELECT f.idForo, c.idCharla, c.nombreCharla, u.idUsuario, u.nombreUsuario, u.apellidosUsuario, u.idRol, f.idComentario, f.comentarioForo, f.fechaComentario FROM tbcharla c, tbusuario u, tbforo f 
    WHERE c.idCharla = f.idCharla AND u.idUsuario = f.idUsuario AND idComentario = pIdForo ORDER BY f.fechaComentario DESC;
END //
DELIMITER ;

/* Mostrar Charla Usuario */
DELIMITER //
CREATE PROCEDURE sp_MostrarCharlaUsuario()
BEGIN
  SELECT cu.idCharlaUsuario, cu.idUsuario, us.nombreUsuario, us.apellidosUsuario, us.correoUsuario, cu.idCharla, ch.nombreCharla, cu.finalizado, cu.fechaMatricula, cu.fechaFinalizacion 
  FROM tbcharlausuario cu, tbcharla ch, tbusuario us WHERE cu.idCharla = ch.idCharla AND us.idUsuario = cu.idUsuario GROUP BY cu.idUsuario;
END //
DELIMITER ;

/*******************************/
DELIMITER //
CREATE PROCEDURE sp_CargarCharlasUsuario(pIdUsuario INT)
BEGIN
    SELECT c.idCharla, c.nombreCharla FROM tbcharla c, tbcharlausuario cu WHERE c.idCharla = cu.idCharla AND cu.idUsuario = pIdUsuario;
END //
DELIMITER ;

/* Agregar, modificar y eliminar Charlas Por Usuarios */
DELIMITER //
CREATE PROCEDURE sp_MantCharlaUsuario( pIdUsuario INT, pIdCharla INT, pFinalizado varchar(200), pModo varchar(200) )
BEGIN

DECLARE errno INT;
DECLARE setidVideo INT;
DECLARE EXIT handler FOR sqlexception
begin
get current diagnostics condition 1 errno = mysql_errno;
SELECT errno as mysql_error;
ROLLBACK;
END;

IF pModo = 'AGREGAR' THEN 
    IF EXISTS (SELECT * FROM tbcharlausuario WHERE idUsuario = pIdUsuario AND idCharla = pIdCharla) THEN 
        SELECT 300;
    ELSE
      start transaction;
            INSERT INTO tbcharlausuario (idUsuario, idCharla, valoracionCharla, finalizado, fechaMatricula, fechaFinalizacion)
            VALUES (pIdUsuario, pIdCharla, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
      select 1;
     commit work;
    END IF;

ELSEIF pModo = 'ELIMINAR' THEN
    start transaction;
    set setidVideo = 0;
    loop_label:  LOOP
    set setidVideo = ( SELECT idVideo FROM tbvideousuario WHERE idUsuario = pIdUsuario AND idVideo > setidVideo AND idvideo = ( SELECT idVideo FROM tbvideocharla vc WHERE vc.idCharla = pIdCharla AND idVideo > setidVideo limit 1 ) limit 1 );
		IF  (setidVideo is null) THEN
			LEAVE  loop_label;
		ELSE
			DELETE FROM tbvideousuario WHERE idVideo = setidVideo AND idUsuario = pIdUsuario ;
		END  IF;
	END LOOP;
    DELETE FROM tbcharlausuario WHERE idUsuario = pIdUsuario AND idCharla = pIdCharla;
    select 2;
    commit work;
ELSE 
    select -1;
END IF;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_CargarPrecioCharla(pIdCharla INT)
BEGIN
    SELECT precioCharla FROM tbcharla WHERE idCharla = pIdCharla;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_VinculacionVideoUsuario(pIdUsuario INT, pIdCharla INT)
BEGIN
DECLARE setIdVideo INT;
	set setIdVideo = 0;
	loop_label:  LOOP
    set setIdVideo = ( SELECT v.idVideo FROM tbvideo v, tbvideocharla vc WHERE vc.idVideo = v.idVideo AND vc.idCharla = pIdCharla AND v.idVideo > setIdVideo LIMIT 1 );
    
		IF  (setIdVideo is null) THEN
			LEAVE  loop_label;
		ELSE
			INSERT INTO tbvideousuario (idusuario, idvideo, visualizado) VALUES (pIdUsuario, setIdVideo, 0);
			Select 1;
		END  IF;
	END LOOP;  
END //
DELIMITER ;

/*video Visto*/
DELIMITER //
CREATE PROCEDURE sp_videoVisto(pIdUsuario INT, pIdVideo INT)
BEGIN
IF EXISTS (SELECT idusuario, idvideo, visualizado
  FROM tbvideousuario WHERE idusuario = pIdUsuario AND idvideo = pIdVideo AND visualizado = 1) THEN 
  SELECT 1;
  ELSE
  UPDATE tbvideousuario SET visualizado = 1 WHERE idusuario = pIdUsuario AND idvideo = pIdVideo;
  SELECT 2;
  commit work;
  END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_CorreosNotificacionActivado()
BEGIN
	SELECT correoUsuario FROM tbusuario WHERE opcionNotificacion = "Activado";
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_CargarIdCompra(pIdUsuario INT, pIdCharla INT)
BEGIN
    SELECT idCharlaUsuario FROM tbcharlausuario WHERE idUsuario = pIdUsuario AND idCharla = pIdCharla;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE sp_VerificaCharlaCompletada(pIdUsuario INT, pIdVideo INT)
BEGIN

DECLARE todosVideosVistos INT;
DECLARE todosVideos INT;
DECLARE vidCharla INT;

	set vidCharla = ( SELECT idCharla FROM tbvideocharla WHERE idVideo = pIdVideo );
    set todosVideos = ( SELECT COUNT(v.idvideo) FROM tbvideousuario v, tbvideocharla vc WHERE v.idusuario = pIdUsuario AND v.idVideo = vc.idVideo AND vc.idcharla = vidCharla  );
    set todosVideosVistos = ( SELECT COUNT(v.idvideo) FROM tbvideousuario v, tbvideocharla vc WHERE idusuario = pIdUsuario AND v.visualizado = 1 AND v.idVideo = vc.idVideo AND vc.idcharla = vidCharla );

    IF (todosVideos = todosVideosVistos ) THEN 
        UPDATE tbcharlausuario SET finalizado = "Si", fechaFinalizacion = CURRENT_TIMESTAMP WHERE idCharla = vidCharla AND idUsuario = pIdUsuario ;
        select 1;
    ELSE
        select 2;
     commit work;
    END IF;
END//
DELIMITER ;

/*valida charla comprada y vista*/
DELIMITER //
CREATE PROCEDURE sp_validaCharlaVC(pIdUsuario INT, pIdCharla INT)/*validad charla vista comprada*/

BEGIN
IF EXISTS (SELECT idUsuario, idCharla, finalizado
  FROM tbcharlausuario WHERE idUsuario = pIdUsuario AND idCharla = pIdCharla AND finalizado = "Si") THEN 
  SELECT 1;
  ELSE
  SELECT 2;
  commit work;
  END IF;
END //
DELIMITER ;

/* */
DELIMITER //
CREATE PROCEDURE sp_CargarCharlaCompletada(pIdUsuario INT, pIdCharla INT)
BEGIN
    SELECT fechaFinalizacion FROM tbcharlaUsuario WHERE idUsuario = pIdUsuario AND idCharla = pIdCharla AND finalizado = "Si";
END//
DELIMITER ;