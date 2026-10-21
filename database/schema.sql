-- =====================================================================
-- Base de Datos: Belleza en un Clic (XAMPP MySQL)
-- Arquitectura de 8 Dominios Funcionales / Microservicios
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `belleza_en_un_clic`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `belleza_en_un_clic`;

-- Desactivar llaves foráneas para recreación limpia si se requiere
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `notificaciones`;
DROP TABLE IF EXISTS `configuracion_sistema`;
DROP TABLE IF EXISTS `personal`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `pqrs`;
DROP TABLE IF EXISTS `direcciones_cliente`;
DROP TABLE IF EXISTS `orden_compra_detalles`;
DROP TABLE IF EXISTS `ordenes_compra`;
DROP TABLE IF EXISTS `proveedores`;
DROP TABLE IF EXISTS `cuadres_caja`;
DROP TABLE IF EXISTS `ventas`;
DROP TABLE IF EXISTS `facturas_dian`;
DROP TABLE IF EXISTS `pedido_items`;
DROP TABLE IF EXISTS `pedidos`;
DROP TABLE IF EXISTS `movimientos_inventario`;
DROP TABLE IF EXISTS `inventario_sedes`;
DROP TABLE IF EXISTS `tonos_producto`;
DROP TABLE IF EXISTS `productos`;
DROP TABLE IF EXISTS `categorias`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `sedes`;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. Sedes (Hubs de distribución y tiendas físicas)
-- ---------------------------------------------------------------------
CREATE TABLE `sedes` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `nombre_completo` VARCHAR(255) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `horario` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(50) NOT NULL,
  `tiempo_entrega` VARCHAR(100) NOT NULL,
  `activa` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Dominio de Usuarios (Microservicio: Usuarios)
-- ---------------------------------------------------------------------
CREATE TABLE `usuarios` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `primer_nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email_dian` VARCHAR(150) NULL,
  `rol` ENUM('cliente', 'admin', 'empleado') NOT NULL DEFAULT 'cliente',
  `tipo_documento` VARCHAR(20) DEFAULT 'C.C.',
  `numero_documento` VARCHAR(50) NULL,
  `telefono` VARCHAR(50) NULL,
  `nivel_glow` VARCHAR(50) DEFAULT 'Glow VIP • Nivel Oro',
  `puntos_glow` INT DEFAULT 2450,
  `meta_puntos_glow` INT DEFAULT 3000,
  `sede_favorita_id` VARCHAR(50) NULL,
  `avatar_url` TEXT NULL,
  `tipo_piel` ENUM('grasa', 'mixta', 'sensible', 'seca') DEFAULT 'mixta',
  `activo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sede_favorita_id`) REFERENCES `sedes`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Dominio de Productos (Microservicio: Productos)
-- ---------------------------------------------------------------------
CREATE TABLE `categorias` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NULL,
  `icono` VARCHAR(50) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `productos` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `ean` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `marca` VARCHAR(100) NOT NULL,
  `categoria_id` VARCHAR(50) NOT NULL,
  `precio` DECIMAL(12,2) NOT NULL,
  `precio_original` DECIMAL(12,2) NULL,
  `rating` DECIMAL(3,2) DEFAULT 5.0,
  `review_count` INT DEFAULT 0,
  `descripcion` TEXT NOT NULL,
  `nota_formula` TEXT NOT NULL,
  `volumen` VARCHAR(50) NOT NULL,
  `imagen_url` TEXT NOT NULL,
  `badge` VARCHAR(50) NULL,
  `badge_type` VARCHAR(50) NULL,
  `codigo_invima` VARCHAR(50) NOT NULL,
  `codigo_lote` VARCHAR(50) NOT NULL,
  `ubicacion_pasillo` VARCHAR(100) NULL,
  `stock_minimo_recomendado` INT DEFAULT 10,
  `activo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tonos_producto` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `producto_id` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `color_hex` VARCHAR(20) NOT NULL,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Dominio de Inventario (Microservicio: Inventario)
-- ---------------------------------------------------------------------
CREATE TABLE `inventario_sedes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `producto_id` VARCHAR(50) NOT NULL,
  `sede_id` VARCHAR(50) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_producto_sede` (`producto_id`, `sede_id`),
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sede_id`) REFERENCES `sedes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `movimientos_inventario` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `producto_id` VARCHAR(50) NOT NULL,
  `sede_origen_id` VARCHAR(50) NOT NULL,
  `sede_destino_id` VARCHAR(50) NULL,
  `tipo` ENUM('entrada', 'salida', 'transferencia', 'ajuste') NOT NULL,
  `cantidad` INT NOT NULL,
  `motivo` VARCHAR(255) NOT NULL,
  `usuario_id` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sede_origen_id`) REFERENCES `sedes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sede_destino_id`) REFERENCES `sedes`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Dominio de Pedidos (Microservicio: Pedidos)
-- ---------------------------------------------------------------------
CREATE TABLE `pedidos` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `usuario_id` VARCHAR(50) NOT NULL,
  `fecha_formato` VARCHAR(100) NOT NULL,
  `timestamp` DATETIME NOT NULL,
  `estado` ENUM('pago_confirmado', 'preparacion_bodega', 'en_ruta', 'entregado') NOT NULL DEFAULT 'pago_confirmado',
  `estado_etiqueta` VARCHAR(100) NOT NULL,
  `total` DECIMAL(12,2) NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  `descuento` DECIMAL(12,2) DEFAULT 0,
  `iva` DECIMAL(12,2) NOT NULL,
  `envio` DECIMAL(12,2) DEFAULT 0,
  `codigo_cupon` VARCHAR(50) NULL,
  `sede_origen_id` VARCHAR(50) NOT NULL,
  `metodo_envio` ENUM('domicilio', 'pickup') NOT NULL DEFAULT 'domicilio',
  `direccion_entrega` TEXT NOT NULL,
  `ventana_estimada` VARCHAR(150) NOT NULL,
  `transportadora` VARCHAR(100) DEFAULT 'Coordinadora Express',
  `numero_guia` VARCHAR(50) NOT NULL,
  `conductor_nombre` VARCHAR(100) NULL,
  `conductor_vehiculo` VARCHAR(150) NULL,
  `conductor_rating` DECIMAL(3,2) NULL,
  `conductor_viajes` INT NULL,
  `conductor_telefono` VARCHAR(50) NULL,
  `conductor_avatar` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sede_origen_id`) REFERENCES `sedes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pedido_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` VARCHAR(50) NOT NULL,
  `producto_id` VARCHAR(50) NULL,
  `nombre_producto` VARCHAR(255) NOT NULL,
  `categoria` VARCHAR(100) NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(12,2) NOT NULL,
  `codigo_lote` VARCHAR(50) NOT NULL,
  `imagen_url` TEXT NOT NULL,
  `volumen_gramos` VARCHAR(50) NULL,
  `tono_seleccionado` VARCHAR(50) NULL,
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `facturas_dian` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` VARCHAR(50) NOT NULL UNIQUE,
  `numero_factura` VARCHAR(50) NOT NULL UNIQUE,
  `cufe` VARCHAR(100) NOT NULL,
  `xml_emitido` TINYINT(1) DEFAULT 1,
  `pdf_listo` TINYINT(1) DEFAULT 1,
  `fecha_emision` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Dominio de Ventas (Microservicio: Ventas)
-- ---------------------------------------------------------------------
CREATE TABLE `ventas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` VARCHAR(50) NOT NULL UNIQUE,
  `sede_id` VARCHAR(50) NOT NULL,
  `usuario_id` VARCHAR(50) NOT NULL,
  `total` DECIMAL(12,2) NOT NULL,
  `metodo_pago` ENUM('pse', 'tarjeta', 'efectivo', 'wompi') NOT NULL,
  `referencia_pago` VARCHAR(100) NOT NULL,
  `fecha_venta` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sede_id`) REFERENCES `sedes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cuadres_caja` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sede_id` VARCHAR(50) NOT NULL,
  `usuario_id` VARCHAR(50) NOT NULL,
  `fecha` DATE NOT NULL,
  `saldo_inicial` DECIMAL(12,2) NOT NULL DEFAULT 200000.00,
  `ventas_efectivo` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `ventas_electronicas` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `saldo_total` DECIMAL(12,2) NOT NULL DEFAULT 200000.00,
  `estado` ENUM('abierta', 'cerrada') DEFAULT 'abierta',
  `notas` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sede_id`) REFERENCES `sedes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Dominio de Proveedores (Microservicio: Proveedores)
-- ---------------------------------------------------------------------
CREATE TABLE `proveedores` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nit` VARCHAR(50) NOT NULL UNIQUE,
  `razon_social` VARCHAR(150) NOT NULL,
  `contacto_nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(50) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `categoria_suministro` VARCHAR(100) NOT NULL,
  `estado` ENUM('activo', 'inactivo') DEFAULT 'activo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ordenes_compra` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `proveedor_id` VARCHAR(50) NOT NULL,
  `sede_destino_id` VARCHAR(50) NOT NULL,
  `fecha_emision` DATE NOT NULL,
  `total` DECIMAL(12,2) NOT NULL,
  `estado` ENUM('borrador', 'enviada', 'recibida', 'pagada') DEFAULT 'enviada',
  `notas` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sede_destino_id`) REFERENCES `sedes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orden_compra_detalles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orden_compra_id` VARCHAR(50) NOT NULL,
  `producto_id` VARCHAR(50) NOT NULL,
  `cantidad` INT NOT NULL,
  `costo_unitario` DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (`orden_compra_id`) REFERENCES `ordenes_compra`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Dominio de Clientes (Microservicio: Clientes)
-- ---------------------------------------------------------------------
CREATE TABLE `direcciones_cliente` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `usuario_id` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(50) NOT NULL,
  `direccion_linea` VARCHAR(255) NOT NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `barrio` VARCHAR(150) NOT NULL,
  `notas` TEXT NULL,
  `es_predeterminada` TINYINT(1) DEFAULT 0,
  `tipo` ENUM('casa', 'trabajo', 'consultorio') DEFAULT 'casa',
  `sede_cercana` VARCHAR(100) NOT NULL,
  `distancia_km` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pqrs` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `usuario_id` VARCHAR(50) NOT NULL,
  `pedido_id` VARCHAR(50) NULL,
  `lote_codigo` VARCHAR(50) NULL,
  `tipo` ENUM('peticion', 'queja', 'envio', 'dermatologica') NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `estado` ENUM('Radicado', 'En Peritaje', 'Resuelto / Aprobado') DEFAULT 'Radicado',
  `resolucion` TEXT NULL,
  `fecha_formato` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `producto_id` VARCHAR(50) NOT NULL,
  `usuario_id` VARCHAR(50) NULL,
  `autor` VARCHAR(100) NOT NULL,
  `ubicacion` VARCHAR(100) NOT NULL,
  `avatar_url` TEXT NULL,
  `es_comprador_verificado` TINYINT(1) DEFAULT 1,
  `es_profesional` TINYINT(1) DEFAULT 0,
  `badge` VARCHAR(50) NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `titulo` VARCHAR(255) NOT NULL,
  `tipo_piel` ENUM('grasa', 'mixta', 'sensible', 'seca') DEFAULT 'mixta',
  `tiempo_uso` VARCHAR(50) NOT NULL,
  `nota_clima` VARCHAR(100) NULL,
  `contenido` TEXT NOT NULL,
  `helpful_count` INT DEFAULT 0,
  `imagenes_json` TEXT NULL,
  `fecha_formato` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Dominio Administrativo (Microservicio: Administrativo)
-- ---------------------------------------------------------------------
CREATE TABLE `personal` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `usuario_id` VARCHAR(50) NOT NULL UNIQUE,
  `cargo` VARCHAR(100) NOT NULL,
  `sede_asignada_id` VARCHAR(50) NOT NULL,
  `salario_base` DECIMAL(12,2) NOT NULL,
  `fecha_ingreso` DATE NOT NULL,
  `estado` ENUM('activo', 'licencia', 'inactivo') DEFAULT 'activo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sede_asignada_id`) REFERENCES `sedes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `configuracion_sistema` (
  `clave` VARCHAR(100) NOT NULL PRIMARY KEY,
  `valor` TEXT NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notificaciones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` VARCHAR(50) NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `canal` ENUM('email', 'sms', 'whatsapp', 'push') NOT NULL DEFAULT 'email',
  `mensaje` TEXT NOT NULL,
  `leido` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
