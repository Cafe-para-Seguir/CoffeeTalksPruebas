use uncafeparaseguir;

/*********************************************/
/****************** USUARIOS *****************/
/*********************************************/

DELIMITER //
CREATE TRIGGER trg_EliminarUsuario
    BEFORE DELETE ON tbusuario FOR EACH ROW
BEGIN
    DELETE FROM tbrecetausuario WHERE idUsuario = OLD.idUsuario;
    DELETE FROM tbvideousuario WHERE idUsuario = OLD.idUsuario;
END//
DELIMITER ;

/*********************************************/
/****************** CHARLAS ******************/
/*********************************************/

DELIMITER //
CREATE TRIGGER trg_EliminarCharla
    BEFORE DELETE ON tbcharla FOR EACH ROW
BEGIN
	DELETE FROM tbcharlacategoria WHERE idCharla = OLD.idCharla;
	DELETE FROM tbcharlacharlista WHERE idCharla = OLD.idCharla;
END//
DELIMITER ;

/*********************************************/
/***************** RECETA ********************/
/*********************************************/

DELIMITER //
CREATE TRIGGER trg_EliminarReceta
    BEFORE DELETE ON tbreceta FOR EACH ROW
BEGIN
	DELETE FROM tbrecetausuario WHERE idReceta = OLD.idReceta;
END//
DELIMITER ;

/*********************************************/
/******************* VIDEO *******************/
/*********************************************/

DELIMITER //
CREATE TRIGGER trg_EliminarVideo
    BEFORE DELETE ON tbvideo FOR EACH ROW
BEGIN
	DELETE FROM tbvideocharla WHERE idVideo = OLD.idVideo;
END//
DELIMITER ;

/************************************************************************************************/
/******************************************** CORREOS *******************************************/
/************************************************************************************************/

DELIMITER //
CREATE PROCEDURE sp_ActividadForo()
BEGIN
  SELECT f.idForo, f.idCharla, c.nombreCharla, u.correoUsuario FROM tbforo f, tbusuario u, tbcharlacharlista cc, tbcharla c WHERE c.idCharla = cc.idCharla AND cc.idUsuario = u.idUsuario AND f.idCharla = cc.idCharla AND                  
  f.fechaComentario BETWEEN DATE_SUB( NOW(), INTERVAL 24 HOUR) AND NOW() AND u.opcionNotificacion = "Activado" GROUP BY idCharla;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_MantCodigoUsuario(pCorreoUsuario varchar(45), pCodigo varchar(8), pTipoCodigo INT, pModo varchar(10))
BEGIN
		start transaction;
        IF pModo = 'AGREGAR' THEN 
            INSERT INTO tbcodigousuario (correoUsuario, codigo, tipoCodigo, fechaCreacion) 
            VALUES (pCorreoUsuario, pCodigo, pTipoCodigo, CURRENT_TIMESTAMP);
		     select 1;
		ELSEIF pModo = 'MODIFICAR' THEN
             UPDATE tbcodigousuario set codigo = pCodigo WHERE correoUsuario = pCorreoUsuario AND tipoCodigo = pTipoCodigo;
             select 1;
		ELSEIF pModo = 'ELIMINAR' THEN
	    DELETE FROM tbcodigousuario WHERE correoUsuario = pCorreoUsuario AND tipoCodigo = pTipoCodigo;
             select 1;
		ELSE
			 select 2;
    	END IF;
     commit work;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_VerificaCodigoCorreo(pCorreoUsuario varchar(45), pCodigo varchar(8), pTipoCodigo INT)
BEGIN
		start transaction;
	IF EXISTS (SELECT * FROM tbcodigousuario WHERE correoUsuario = pCorreoUsuario AND codigo = pCodigo AND tipoCodigo = pTipoCodigo) THEN 
	UPDATE tbusuario SET validadoUsuario = 1
	WHERE correoUsuario = pCorreoUsuario;
	select 1;
        ELSE
    select 2;
    	END IF;
     commit work;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_VerificaCodigoContra(pCorreoUsuario varchar(45), pCodigo varchar(8), pTipoCodigo INT)
BEGIN
		start transaction;
	IF EXISTS (SELECT * FROM tbcodigousuario WHERE correoUsuario = pCorreoUsuario AND codigo = pCodigo AND tipoCodigo = pTipoCodigo) THEN 
	select 1;
        ELSE
    select 2;
    	END IF;
     commit work;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_VerificaCorreo_CodigoUsuario(pCorreoUsuario varchar(45))
BEGIN
		start transaction;
	IF EXISTS (SELECT * FROM tbcodigousuario WHERE correoUsuario = pCorreoUsuario ) THEN 
	select 1;
    ELSE
    select 2;
    	END IF;
     commit work;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_VerificaCorreo_tbUsuario(pCorreoUsuario varchar(45))
BEGIN
		start transaction;
	IF EXISTS (SELECT * FROM tbusuario WHERE correoUsuario = pCorreoUsuario ) THEN 
	select 1;
    ELSE
    select 2;
    	END IF;
     commit work;
END //
DELIMITER ;

DELIMITER |
CREATE EVENT borrarCodigosUsuario
    ON SCHEDULE EVERY 1 HOUR
    ON COMPLETION PRESERVE
    DO
      BEGIN
            DELETE FROM tbcodigousuario WHERE fechaCreacion < (CURRENT_TIMESTAMP - INTERVAL 1 HOUR); 
			DELETE FROM tbusuario WHERE fechaCreacion < (CURRENT_TIMESTAMP - INTERVAL 1 HOUR) AND validadoUsuario = 0;
      END |
DELIMITER ;

/************************************************************************************************/
/******************************************** REPORTES *******************************************/
/************************************************************************************************/


/*************************** CANTIDAD DE USUARIOS REGISTRADOS ***************************/
DELIMITER //
CREATE PROCEDURE sp_ReporteCantUsuarios(pFechaInicio VARCHAR(15), pFechaFin VARCHAR(15), pIdRol INT)
BEGIN
	SELECT count(u.idUsuario) as cantUsuario,  DATE(u.fechaCreacion) as fecha
	FROM tbusuario u, tbrol r 
	WHERE (fechaCreacion BETWEEN DATE(str_to_date(pFechaInicio,'%Y-%m-%d')) AND DATE(str_to_date(pFechaFin,'%Y-%m-%d'))) AND u.idRol = pIdRol AND r.idRol = u.idRol
	GROUP BY fechaCreacion;
END //
DELIMITER ;

/*************************** CANTIDAD DE CHARLAS DEL SITIO ***************************/
DELIMITER //
CREATE PROCEDURE sp_ReporteCantCharlas(pFechaInicio VARCHAR(15), pFechaFin VARCHAR(15))
BEGIN
	SELECT cat.nombreCategoria, ( SELECT COUNT(cc.idCharla) 
	FROM tbcharla c, tbcategoria cat, tbcharlacategoria chc
	WHERE c.idCharla = chc.idCharla AND cat.idCategoria = chc.idCategoria
	group by cat.idCategoria limit 1) AS cantCharlas

FROM tbcharla cc, tbcategoria cat, tbcharlacategoria chc
WHERE cc.idCharla = chc.idCharla AND cat.idCategoria = chc.idCategoria 
AND (cc.fechaCreacion BETWEEN DATE(str_to_date(pFechaInicio,'%Y-%m-%d')) AND DATE(str_to_date(pFechaFin,'%Y-%m-%d')))
GROUP BY chc.idCategoria;
END //
DELIMITER ;

/*************************** TOP 10 CHARLAS MEJOR CALIFICADAS ***************************/
DELIMITER //
CREATE PROCEDURE sp_ReporteTopCharlas()
BEGIN
	SELECT nombreCharla, valoracionCharla
	FROM tbcharla
	ORDER BY valoracionCharla
	DESC LIMIT 10;
END //
DELIMITER ;

/*************************** TOP 10 CHARLISTAS MEJOR CALIFICADOS ***************************/
DELIMITER //
CREATE PROCEDURE sp_ReporteTopCharlistas()
BEGIN
	SELECT nombreUsuario, apellidosUsuario, valoracionCharlista
	FROM tbusuario
	WHERE idRol = 2
	ORDER BY valoracionCharlista
	DESC LIMIT 10;
END //
DELIMITER ;

/********* TOP 10 CHARLAS MÁS VENDIDAS *********/
DELIMITER //
CREATE PROCEDURE sp_TopCharlasVendidas()
BEGIN
	SELECT COUNT(cu.idCharla) as cantidad, ch.nombreCharla
	FROM tbcharlausuario cu, tbcharla ch, tbusuario us
	WHERE cu.idCharla = ch.idCharla AND us.idUsuario = cu.idUsuario
	GROUP BY ch.nombreCharla
	ORDER BY COUNT(cu.idCharla)
	DESC LIMIT 10;
END //
DELIMITER ;

/********* REPORTE DE VENTAS *********/
DELIMITER //
CREATE PROCEDURE sp_ReporteVentas(pFechaInicio VARCHAR(15), pFechaFin VARCHAR(15))
BEGIN
	SELECT cu.idCharla, SUM(ch.precioCharla) as Total, DATE(cu.fechaMatricula) as fechaMatricula
	FROM tbcharlausuario cu, tbcharla ch
	WHERE cu.idCharla = ch.idCharla AND DATE(cu.fechaMatricula) BETWEEN DATE(str_to_date(pFechaInicio,'%Y-%m-%d')) AND DATE(str_to_date(pFechaFin,'%Y-%m-%d'))
	GROUP BY DATE(cu.fechaMatricula);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_ReporteGananciaCharlista(pMes INT, pAnno INT)
BEGIN
	SELECT SUM(ch.precioCharla) as Ganancia, usu.nombreUsuario AS Charlista 
    FROM tbcharlaUsuario chusu, tbcharla ch, tbusuario usu, tbcharlacharlista chch WHERE chusu.idCharla = ch.idCharla
	AND usu.idUsuario = chch.idUsuario AND chch.idCharla = ch.idCharla 
	AND MONTH(chusu.fechaMatricula) = pMes AND YEAR(chusu.fechaMatricula) = pAnno
	GROUP BY usu.nombreUsuario;
END //
DELIMITER ;