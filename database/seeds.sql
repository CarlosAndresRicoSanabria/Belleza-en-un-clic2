USE `belleza_en_un_clic`;

-- ---------------------------------------------------------------------
-- 1. Sedes
-- ---------------------------------------------------------------------
INSERT INTO `sedes` (`id`, `nombre`, `nombre_completo`, `direccion`, `horario`, `telefono`, `tiempo_entrega`) VALUES
('bogota', 'Sede Bogotá', 'Sede Principal Bogotá · Calle 85 (Hub Central)', 'Calle 85 # 11-53, Local 204, Zona Rosa, Bogotá D.C.', 'Lun - Sáb: 9:00 AM - 8:00 PM | Dom: 10:00 AM - 5:00 PM', '+57 (601) 745 8820', 'Despacho express < 2h en el norte de Bogotá'),
('medellin', 'Sede Medellín', 'Sede Medellín · El Poblado (Hub Antioquia)', 'Carrera 43A # 5A-113, Centro Empresarial One Plaza, Medellín', 'Lun - Sáb: 9:30 AM - 7:30 PM', '+57 (604) 448 9120', 'Despacho express < 3h Valle de Aburrá'),
('cali', 'Sede Cali', 'Sede Cali · Barrio Granada (Hub Suroccidente)', 'Avenida 9N # 14N-32, Granada Boutique, Cali', 'Lun - Sáb: 9:00 AM - 7:00 PM', '+57 (602) 889 4430', 'Despacho express < 3h zona urbana');

-- ---------------------------------------------------------------------
-- 2. Categorías
-- ---------------------------------------------------------------------
INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `icono`) VALUES
('facial', 'Cuidado Facial', 'Fórmulas dermocosméticas avanzadas para el cuidado diario', 'spa'),
('maquillaje', 'Maquillaje', 'Bases, labiales y correctores de larga duración con activos botánicos', 'brush'),
('serums', 'Sérums & Tratamientos', 'Concentrados de alta potencia con niacinamida, retinol y ácido hialurónico', 'science'),
('solar', 'Protección Solar', 'Bloqueadores y filtros de amplio espectro UVA/UVB no comedogénicos', 'wb_sunny');

-- ---------------------------------------------------------------------
-- 3. Usuarios (Admin, Empleado y Clientes)
-- Clave por defecto cifrada o estándar para pruebas: 'belleza123' (password_hash)
-- ---------------------------------------------------------------------
INSERT INTO `usuarios` (`id`, `nombre`, `primer_nombre`, `email`, `password_hash`, `email_dian`, `rol`, `tipo_documento`, `numero_documento`, `telefono`, `nivel_glow`, `puntos_glow`, `meta_puntos_glow`, `sede_favorita_id`, `avatar_url`, `tipo_piel`) VALUES
('usr-sofia', 'Sofía Gómez Arboleda', 'Sofía', 'sofia.gomez@glow.co', '$2y$10$w0f0jRzFh5sY7W.8KxKzIe2M0cW48hQvVvP.mD/9bXnN0Fz2.Hnuy', 'valeria.gomez@empresa.com.co', 'cliente', 'C.C.', '1.020.458.912', '+57 312 849 2034', 'Glow VIP • Nivel Oro', 2450, 3000, 'bogota', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBahX2bkwFNwlNl79RGiLu0LbqbCR-wcPIh93ocbUxbrLgkl8uH3pKahmTTUz48RPQ1X9DI-48Crliziw0AdXFN7X6FONERA3arANSsdBdmaMxWo7IiM5vDYI0pP5ZUARnIK_Y6OGj9ER2hZmrHKcrzAr2dr2dhydgelRKAXnLug4FTsdi14BM0VqFxWa9pgbJ5kfv7w-XCi9WUe3Wpzm0Fx9bWeXi7gndzz8DoGmVd5Cg6PgfknBMj', 'mixta'),
('usr-admin', 'Carlos Andrés Rico Sanabria', 'Carlos', 'admin@bellezaenunclic.com', '$2y$10$w0f0jRzFh5sY7W.8KxKzIe2M0cW48hQvVvP.mD/9bXnN0Fz2.Hnuy', 'facturacion@bellezaenunclic.com', 'admin', 'C.C.', '1.018.992.341', '+57 300 123 4567', 'Administrador Central', 5000, 5000, 'bogota', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', 'mixta'),
('usr-empleado', 'Julián Morales Herrera', 'Julián', 'bodega.bogota@bellezaenunclic.com', '$2y$10$w0f0jRzFh5sY7W.8KxKzIe2M0cW48hQvVvP.mD/9bXnN0Fz2.Hnuy', 'bodega@bellezaenunclic.com', 'empleado', 'C.C.', '79.845.120', '+57 315 987 6543', 'Operador Logístico Sede', 1000, 2000, 'bogota', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'grasa');

-- ---------------------------------------------------------------------
-- 4. Productos
-- ---------------------------------------------------------------------
INSERT INTO `productos` (`id`, `sku`, `ean`, `nombre`, `marca`, `categoria_id`, `precio`, `precio_original`, `rating`, `review_count`, `descripcion`, `nota_formula`, `volumen`, `imagen_url`, `badge`, `badge_type`, `codigo_invima`, `codigo_lote`, `ubicacion_pasillo`, `stock_minimo_recomendado`) VALUES
('p1', 'SKU-BE-001', 'EAN-77092182', 'Sérum Reparador Niacinamida 10% + Zinc', 'RadiantSkin', 'serums', 78000.00, 89000.00, 4.90, 128, 'Equilibra la producción sebácea y atenúa poros dilatados con acabado sedoso y absorción rápida sin grumos.', 'Niacinamida 10% grado dermatológico + Zinc PCA botánico 1%', '30 ml', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQXQhLb-rTymgecPLtWGLGiVKUMWnIOCn8l3YeYtDgdix0r2YenKy3Q9JnzA4zAmb3R2Y4d5SAL_nrkjl_ZvRA8jIRpIlY7Jnqyj4Ty3OeuVdVgkyJt6Dtk4tDpRv3Sr3pPK9IY4zLaMvodKZgOd5y5L_5S-nt7Ur9I5gTDcZYl9e5asjTCOewH2Rv1ci9cPgn6voabHP0CgF2fu_978lHZ7d4T082pbPT3jFpTzIbnm0SGDL5EKUv', 'Bestseller', 'bestseller', 'NSOC94821-21CO', '#H24-902', 'Pasillo B · Estante 3', 8),
('p2', 'SKU-BE-002', 'EAN-77092183', 'Crema Hidratante Ácido Hialurónico Multicapa', 'Glow Botanics', 'facial', 92000.00, 105000.00, 4.80, 94, 'Tres densidades moleculares para infundir agua profunda y rellenar líneas finas con textura en gel acuoso.', 'Ácido Hialurónico Triple Esfera + Ceramidas NP y AP', '50 ml', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf2tszO_fl_7fdJnUsKIjALppfBJcDiU18Sr73Kcoksl619doy_8Sw8eAvdy3Ar31mmGn0yd3cZ06sIfnN--t2MqJJdkeQoBKg9m8JbToAIz6fvkc-_CEifOBYAZIj6odjwKxDHL5dSt5VfMvIQnp4cGX6vmUkQlP5_5xnyAYOwuOu8m2LqgFgBWUJubrj680j8_ssZ-Bs6SOrasY8giPJupOGw5W8ZqEDXr1s2j5ItPYUCfv6o73W', 'Hidratación 72h', 'hydration', 'NSOC98124-22CO', '#BL-50ML', 'Pasillo A · Estante 1', 10),
('p3', 'SKU-BE-003', 'EAN-77092184', 'Base Fluida Acabado Satinado SPF 30', 'L\'Éclat Paris', 'maquillaje', 115000.00, 125000.00, 5.00, 62, 'Cobertura media modulable con efecto segunda piel luminosa sin sensación grasa ni transferencia.', 'Pigmentos micronizados + Escualano vegetal + Filtros solares físicos', '30 ml', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB13CFFUFKpTUqALYNBvMEBBW7LR5zmBE03zf7dQCZM9NjICzQR_oNoZ13R2KTOw-ipJeISnJIyRHmJOc9aTho9b6IXIEOfpXGBMwijnfWTbn247qpJoW094CxT-KaOZxsAnBclbU8qtp8ZN7SqWJon0lrJpGivG5pvNfnveCUnKVkVAZMZKUOu3SGMgBRdQLaY1G-Pm-TVMrTaKhnulrSEmLiqy9u7buvETx8bUsPmMHQGjk1OIgVx', 'SPF 30', 'spf', 'NSOC88210-20CO', '#BF-3021', 'Pasillo D · Gaveta 12', 6),
('p4', 'SKU-BE-004', 'EAN-77092185', 'Labial Mate Terciopelo Larga Duración', 'Velvet Lab', 'maquillaje', 45000.00, 52000.00, 4.70, 88, 'Textura suave con aceite de argán que evita cuarteaduras y fija el color intenso durante 16 horas.', 'Aceite de Argán prensado en frío + Ceras botánicas', '3.8 g', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7_l3qVpcdRcLCpcZAOCDMM5eYupoCC0SZKBiTJyiTSVykKOUJD2d7IsHEu5kJgEH8tihQJzzeMfE0wCVmM-D8Uvp9i1uNy0pMkr9WSRV-AhOwlZuKjSXHVDWVOBmdJ1C7xorxOwJzzWxESpvmWCeZNzFZr6Il6qQuM-03F-JGhhTDvVtGCT0eSgPqUzXbo2arr8UsmhmeYwXWmLKn2z34GBqjZOC3RxZYM0Y9XbsY7ULEFxj184J_', '16h Confort', 'comfort', 'NSOC83452-19CO', '#LR-8120', 'Pasillo C · Gaveta 4', 12),
('p5', 'SKU-BE-005', 'EAN-77092186', 'Protector Solar Toque Seco Invisible SPF 50+', 'RadiantSkin', 'solar', 88000.00, 98000.00, 4.90, 150, 'Cero residuo blanco, rápida absorción mate y alta protección fotoestable contra rayos UVA/UVB y luz azul.', 'Óxido de Zinc no nano + Dióxido de Titanio + Vitamina E', '50 ml', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmwmI0C-Y35SOiIWFWNGERHDr4JZJrjYpG46abuA5EZ7x3XY4YrBXDsnFDy3Wqz85zb5eVl0d2EP79eeiYSvs9o46a9--Au2ofRIdlp1qUbpLnkx9jLGAtB_8GMZZkuA5fpaW03jhml7ZjF5n4usmAq6R0q7rHW2D4dCIGMyuTSi_-bDTN8LWwOWx_MCmObnVHJD_BoBqC-gwZWHVBQ3yfCVznnTnJ64OIaI0aWJtctC_NnBaR24AL', 'Broad Spectrum', 'spf', 'NSOC99451-22CO', '#PS-5022', 'Pasillo B · Estante 5', 15),
('p6', 'SKU-BE-006', 'EAN-77092187', 'Contorno de Ojos con Péptidos & Cafeína', 'Glow Botanics', 'facial', 69000.00, 79000.00, 4.60, 41, 'Reduce ojeras vasculares y bolsas matutinas gracias a su cabezal refrescante metálico de contacto frío.', 'Péptidos Matrixyl 3000 + Cafeína pura 5% + Extracto de Té Verde', '15 ml', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_Idks40m69p_qXT-ERI7oErQJ5nJs4UnxhN_M7Rhb1x805nnSRvWO-kuV0yzhQiDwaWl7MMP6RxBps4tHE9490ckOrhIhKh2lWS-uBuJS65D5OH08_OqAmB9XA-e5e5So3T2ueFYvR4soGTtHaXzXe_hra30NyzRM_foRbjMvu0Y5-n2ZugVN5uNUacAr1UGhPRsL6r9kmd4dWMyfIF2y04Awm3OHSFPbNGhZsqJ8neKqWsm3saCm', 'Efecto Frío', 'cold', 'NSOC91024-21CO', '#CO-1590', 'Pasillo A · Gaveta 2', 6);

-- ---------------------------------------------------------------------
-- 5. Tonos de Producto
-- ---------------------------------------------------------------------
INSERT INTO `tonos_producto` (`producto_id`, `nombre`, `color_hex`) VALUES
('p3', '01 Nude Claro', '#F3D5C0'),
('p3', '02 Miel Cálido', '#DFB494'),
('p3', '03 Caramelo', '#B3805B'),
('p4', 'Rosa Nude', '#C78283'),
('p4', 'Burgundy Deep', '#6A1A24'),
('p4', 'Rosewood Velour', '#B84E5B');

-- ---------------------------------------------------------------------
-- 6. Inventario por Sedes
-- ---------------------------------------------------------------------
INSERT INTO `inventario_sedes` (`producto_id`, `sede_id`, `stock`) VALUES
('p1', 'bogota', 14),
('p1', 'medellin', 9),
('p1', 'cali', 6),
('p2', 'bogota', 8),
('p2', 'medellin', 15),
('p2', 'cali', 4),
('p3', 'bogota', 5),
('p3', 'medellin', 11),
('p3', 'cali', 8),
('p4', 'bogota', 22),
('p4', 'medellin', 4),
('p4', 'cali', 17),
('p5', 'bogota', 19),
('p5', 'medellin', 28),
('p5', 'cali', 15),
('p6', 'bogota', 3),
('p6', 'medellin', 12),
('p6', 'cali', 2);

-- ---------------------------------------------------------------------
-- 7. Pedidos Iniciales
-- ---------------------------------------------------------------------
INSERT INTO `pedidos` (`id`, `usuario_id`, `fecha_formato`, `timestamp`, `estado`, `estado_etiqueta`, `total`, `subtotal`, `descuento`, `iva`, `envio`, `codigo_cupon`, `sede_origen_id`, `metodo_envio`, `direccion_entrega`, `ventana_estimada`, `transportadora`, `numero_guia`, `conductor_nombre`, `conductor_vehiculo`, `conductor_rating`, `conductor_viajes`, `conductor_telefono`, `conductor_avatar`) VALUES
('#BEC-2026-8942', 'usr-sofia', 'Hoy, 11:24 AM', '2026-10-21 11:24:00', 'en_ruta', 'En Tránsito Nacional', 187300.00, 170000.00, 15000.00, 32300.00, 0.00, 'BIENVENIDA', 'bogota', 'domicilio', 'Cra 15 # 88-21, Apto 502, Chicó Norte, Bogotá D.C.', 'Hoy, 4:30 PM – 7:00 PM (~35 min)', 'Coordinadora Express', '#ENV-983124', 'Carlos Mendieta', 'Móvil Certificado #42 • Moto Express', 4.90, 420, '+57 310 882 9940', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTjj87KbaqH0tXurf4Wpsp-yEppwldRySdKjFeVL4Zu-SdcFCNErRvF1qbsi0HYksWT5PAPX5l-SIY-0ebbX4i9TZ7Dnjcpllbw5o2OEBYSKNTIuM0Gs4HnJqf-KzuzCm0HweH-pOXkqBHnjnY23NDW1X4tyn5PudkHNKdV4pfQ_ZyEoXFeEtPZGJOreBXqx85t7q5yMi7C8tdgzyahj5AiZ59zX0z7Wtl0hupA4i4MRrph3Z6-9Ca'),
('#BEC-2026-7712', 'usr-sofia', '12 de Febrero 2026 • 03:45 PM', '2026-02-12 15:45:00', 'entregado', 'Entregado con Éxito', 184000.00, 184000.00, 0.00, 34960.00, 0.00, NULL, 'bogota', 'domicilio', 'Cra 15 # 88-21, Apto 502, Bogotá D.C.', 'Entregado a portería', 'Coordinadora Express', '#ENV-971034', 'Andrés Castro', 'Furgón Urbano Coordinadora', 4.85, 310, '+57 311 234 5678', NULL),
('#BEC-2026-6540', 'usr-sofia', '18 de Enero 2026 • 11:20 AM', '2026-01-18 11:20:00', 'entregado', 'Entregado con Éxito', 221000.00, 221000.00, 0.00, 41990.00, 0.00, NULL, 'bogota', 'domicilio', 'Cra 15 # 88-21, Apto 502, Bogotá D.C.', 'Entregado a cliente', 'Coordinadora Express', '#ENV-954011', 'Nelson Reyes', 'Moto Mensajería Express', 4.92, 580, '+57 312 901 2345', NULL);

-- ---------------------------------------------------------------------
-- 8. Items de Pedidos
-- ---------------------------------------------------------------------
INSERT INTO `pedido_items` (`pedido_id`, `producto_id`, `nombre_producto`, `categoria`, `cantidad`, `precio_unitario`, `codigo_lote`, `imagen_url`, `volumen_gramos`, `tono_seleccionado`) VALUES
('#BEC-2026-8942', 'p1', 'Sérum Facial Niacinamida 10% + Zinc', 'Dermocosmética', 1, 78000.00, '#H24-902', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQXQhLb-rTymgecPLtWGLGiVKUMWnIOCn8l3YeYtDgdix0r2YenKy3Q9JnzA4zAmb3R2Y4d5SAL_nrkjl_ZvRA8jIRpIlY7Jnqyj4Ty3OeuVdVgkyJt6Dtk4tDpRv3Sr3pPK9IY4zLaMvodKZgOd5y5L_5S-nt7Ur9I5gTDcZYl9e5asjTCOewH2Rv1ci9cPgn6voabHP0CgF2fu_978lHZ7d4T082pbPT3jFpTzIbnm0SGDL5EKUv', '30 ml', NULL),
('#BEC-2026-8942', 'p2', 'Crema Hidratante Barrera Lipídica Hialurónico', 'Reparación Celular', 1, 92000.00, '#BL-50ML', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf2tszO_fl_7fdJnUsKIjALppfBJcDiU18Sr73Kcoksl619doy_8Sw8eAvdy3Ar31mmGn0yd3cZ06sIfnN--t2MqJJdkeQoBKg9m8JbToAIz6fvkc-_CEifOBYAZIj6odjwKxDHL5dSt5VfMvIQnp4cGX6vmUkQlP5_5xnyAYOwuOu8m2LqgFgBWUJubrj680j8_ssZ-Bs6SOrasY8giPJupOGw5W8ZqEDXr1s2j5ItPYUCfv6o73W', '50 ml', NULL),
('#BEC-2026-7712', 'p6', 'Contorno de Ojos Péptidos & Cafeína', 'Cuidado Facial', 1, 92000.00, '#CO-1590', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_Idks40m69p_qXT-ERI7oErQJ5nJs4UnxhN_M7Rhb1x805nnSRvWO-kuV0yzhQiDwaWl7MMP6RxBps4tHE9490ckOrhIhKh2lWS-uBuJS65D5OH08_OqAmB9XA-e5e5So3T2ueFYvR4soGTtHaXzXe_hra30NyzRM_foRbjMvu0Y5-n2ZugVN5uNUacAr1UGhPRsL6r9kmd4dWMyfIF2y04Awm3OHSFPbNGhZsqJ8neKqWsm3saCm', '15 ml', NULL),
('#BEC-2026-7712', 'p3', 'Base Fluida Satinado SPF 30', 'Maquillaje', 1, 92000.00, '#BF-3021', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB13CFFUFKpTUqALYNBvMEBBW7LR5zmBE03zf7dQCZM9NjICzQR_oNoZ13R2KTOw-ipJeISnJIyRHmJOc9aTho9b6IXIEOfpXGBMwijnfWTbn247qpJoW094CxT-KaOZxsAnBclbU8qtp8ZN7SqWJon0lrJpGivG5pvNfnveCUnKVkVAZMZKUOu3SGMgBRdQLaY1G-Pm-TVMrTaKhnulrSEmLiqy9u7buvETx8bUsPmMHQGjk1OIgVx', '30 ml', '01 Nude Claro');

-- ---------------------------------------------------------------------
-- 9. Facturas Electrónicas DIAN
-- ---------------------------------------------------------------------
INSERT INTO `facturas_dian` (`pedido_id`, `numero_factura`, `cufe`, `xml_emitido`, `pdf_listo`, `fecha_emision`) VALUES
('#BEC-2026-8942', 'FEL-2026-00892', '893ab491c6e289f001ba92048fe89a24761e', 1, 1, '2026-10-21 11:24:00'),
('#BEC-2026-7712', 'FEL-2026-00712', '7a82b9e403d19f56e9c289a814bd91c28901', 1, 1, '2026-02-12 15:45:00'),
('#BEC-2026-6540', 'FEL-2026-00412', 'd311fa8912e77b1029ba88bb019488a0021c', 1, 1, '2026-01-18 11:20:00');

-- ---------------------------------------------------------------------
-- 10. Ventas & Cuadres de Caja
-- ---------------------------------------------------------------------
INSERT INTO `ventas` (`pedido_id`, `sede_id`, `usuario_id`, `total`, `metodo_pago`, `referencia_pago`, `fecha_venta`) VALUES
('#BEC-2026-8942', 'bogota', 'usr-sofia', 187300.00, 'pse', 'PSE-BOG-9831201', '2026-10-21 11:24:00'),
('#BEC-2026-7712', 'bogota', 'usr-sofia', 184000.00, 'tarjeta', 'CARD-AUTH-77128', '2026-02-12 15:45:00'),
('#BEC-2026-6540', 'bogota', 'usr-sofia', 221000.00, 'wompi', 'WOMPI-TX-65401', '2026-01-18 11:20:00');

INSERT INTO `cuadres_caja` (`sede_id`, `usuario_id`, `fecha`, `saldo_inicial`, `ventas_efectivo`, `ventas_electronicas`, `saldo_total`, `estado`, `notas`) VALUES
('bogota', 'usr-admin', '2026-10-21', 250000.00, 180000.00, 592300.00, 1022300.00, 'abierta', 'Cuadre del turno de la mañana - Sede Bogotá'),
('medellin', 'usr-admin', '2026-10-21', 200000.00, 95000.00, 310000.00, 605000.00, 'abierta', 'Apertura de turno El Poblado'),
('cali', 'usr-admin', '2026-10-21', 200000.00, 45000.00, 180000.00, 425000.00, 'abierta', 'Turno Granada normal');

-- ---------------------------------------------------------------------
-- 11. Proveedores y Órdenes de Compra
-- ---------------------------------------------------------------------
INSERT INTO `proveedores` (`id`, `nit`, `razon_social`, `contacto_nombre`, `email`, `telefono`, `direccion`, `ciudad`, `categoria_suministro`) VALUES
('prov-radiant', '901.458.120-1', 'Radiant Labs Dermo Colombia S.A.S.', 'Dra. Marcela Silva', 'ventas@radiantskin.co', '+57 (601) 890 4400', 'Zona Franca Fontibón Km 3', 'Bogotá D.C.', 'Sérums & Activos Dermatológicos'),
('prov-glow', '900.871.340-5', 'Glow Botanics Suramérica Ltda.', 'Ing. Felipe Durán', 'suministros@glowbotanics.com', '+57 (604) 310 9922', 'Parque Tecnológico Las Palmas', 'Medellín', 'Cuidado Facial & Hidratación'),
('prov-eclat', '901.092.451-9', 'Cosméticos L\'Éclat Paris Colombia', 'Camila Benavides', 'pedidos@leclat.com.co', '+57 (601) 650 1190', 'Calle 100 # 19A-40', 'Bogotá D.C.', 'Bases & Maquillaje de Alta Gama');

INSERT INTO `ordenes_compra` (`id`, `proveedor_id`, `sede_destino_id`, `fecha_emision`, `total`, `estado`, `notas`) VALUES
('OC-2026-101', 'prov-radiant', 'bogota', '2026-10-15', 3500000.00, 'recibida', 'Reabastecimiento mensual Sérum Niacinamida + Bloqueador Solar'),
('OC-2026-102', 'prov-glow', 'medellin', '2026-10-18', 2100000.00, 'enviada', 'Reposición de Crema Ácido Hialurónico y Contornos');

-- ---------------------------------------------------------------------
-- 12. Direcciones de Cliente
-- ---------------------------------------------------------------------
INSERT INTO `direcciones_cliente` (`id`, `usuario_id`, `nombre`, `telefono`, `direccion_linea`, `ciudad`, `barrio`, `notas`, `es_predeterminada`, `tipo`, `sede_cercana`, `distancia_km`) VALUES
('addr-1', 'usr-sofia', 'Casa / Residencia', '+57 312 849 2034', 'Carrera 15 # 88-21, Apto 502', 'Bogotá D.C., Cundinamarca', 'Barrio Chicó Norte, Edificio Torre Médica / Residencial', 'Instrucción: Dejar con el vigilante Nelson en Torre 2. Solicitar timbre si es después de las 6:00 PM.', 1, 'casa', 'Sede Bogotá Calle 85', '1.4 km'),
('addr-2', 'usr-sofia', 'Trabajo / Oficina', '+57 312 849 2034', 'Calle 72 # 9-55, Oficina 401 (Recepción Piso 4)', 'Bogotá D.C., Cundinamarca', 'Barrio Chapinero / Zona Financiera', 'Horario de recepción: Lunes a Viernes de 8:00 AM a 5:30 PM. No recibir fines de semana.', 0, 'trabajo', 'Sede Bogotá Calle 85', '3.1 km');

-- ---------------------------------------------------------------------
-- 13. PQRS
-- ---------------------------------------------------------------------
INSERT INTO `pqrs` (`id`, `usuario_id`, `pedido_id`, `lote_codigo`, `tipo`, `titulo`, `descripcion`, `estado`, `resolucion`, `fecha_formato`) VALUES
('#PQRS-2026-0412', 'usr-sofia', '#BEC-2026-6540', '#PS-5022', 'envio', 'Novedad de Entrega Coordinadora', 'Demora en primer intento de entrega en portería por parte de la transportadora.', 'Resuelto / Aprobado', 'Reposición despachada el 02 Feb 2026 con guía prioritaria #98124012 y bono de disculpa otorgado.', '28 Ene 2026');

-- ---------------------------------------------------------------------
-- 14. Reviews (Reseñas Dermocosméticas)
-- ---------------------------------------------------------------------
INSERT INTO `reviews` (`id`, `producto_id`, `usuario_id`, `autor`, `ubicacion`, `avatar_url`, `es_comprador_verificado`, `es_profesional`, `badge`, `rating`, `titulo`, `tipo_piel`, `tiempo_uso`, `nota_clima`, `contenido`, `helpful_count`, `imagenes_json`, `fecha_formato`) VALUES
('rev-1', 'p1', 'usr-sofia', 'Camila Restrepo', 'Bogotá D.C.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmu7innnLFTqhfihK8EEnhmXGhC8KBvgvlYW763KagZEBy2Nawp1wfa04l04uOmp7Qw8oMZUckOvLLqh6ACilLfL-8zlIQzeZGHi--6sslhAL4FswWWkTwbZa1HZ5KfxFTmE9-cgv6EZ1s2JGGEnjEatGaiS1zb4BK_Faqhn2e0FBWRG1KLKG2vEpauEPxsQMREeCDpGTKOK2QSR2u78UEi2wB6Z_4IToSL2ZjK_eOvutdunQ6Rpg2', 1, 0, 'VIP Oro', 5, '¡El santo grial para el brillo en la Zona T!', 'mixta', '3 semanas', 'Clima templado/frío', 'Llevo 3 semanas usándolo a diario en mi rutina de la mañana en Bogotá. La textura es ultra ligera, se absorbe en menos de 20 segundos y lo mejor es que no hace grumos ni efecto borrador al aplicar mi protector solar mineral. El brillo en la frente y nariz se redujo de manera impresionante sin resecarme las mejillas. ¡100% recomendado!', 42, '["https://lh3.googleusercontent.com/aida-public/AB6AXuD2vxnYmj9_xNiV7niXIOb20EydaJQOQfK0AQ8Kfid2CjV6Ow4VT6xWTMDsFb-auNPuM8_dOUt8bU1FvV7GfACtvByoSjC18MnLYUvX-HWy95BtHaSqOu6LgSiWZd3zCS4dDfcJJHhbMVcPQhgaI3VwRtfjql30gtOY81419nCcUmFF3rrGNgnR1MyyDv7aQL9sOyg8TBTb3BC4PDWqVNcxqfmrNoAodtR9vP1yKCtln0dnaHY_r778"]', 'Hace 4 días'),
('rev-2', 'p1', NULL, 'Dra. Juliana Morales', 'Medellín', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbe3rpjgcVCZs5qvKSvVsEfsAUWzqjeNyITaKqTJGGr3I-LfC3EGwpebY3BbePKaxjR8vZiW8k4sTnajiktc0TZD24dlUl8nYIFi74GSYqI8el4BJFAOryPPTdnXpe3TBXe6Ynj09RJAwtQN0DzG0V9FYkBvqyzQIsiZBVkSBAqBuRkZHBheKyvB6UEFB4zkcAveAlj2QUWFTfAOo4Xcd7Xdhg70nhG45ZDzoa74IGf0Maks7EWVcz', 1, 1, 'Dermoconsultora Glow', 5, 'Excelente tolerancia en pieles reactivas y con rosácea leve', 'sensible', '2 meses', 'Opinión Profesional Médica', 'Como especialista destaco la formulación con pH balanceado (5.5) y la inclusión de zinc botánico calmante. En pacientes con eritema difuso o tendencia acneica hormonal ha demostrado reforzar la barrera cutánea sin generar purga agresiva ni irritaciones. Excelente relación calidad-precio para dermocosmética nacional.', 89, NULL, 'Hace 1 semana'),
('rev-3', 'p1', NULL, 'Valentina Pardo', 'Cali', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG4OO6jfVdBEkgROUz7XAbd0akxcIKISDXzYEQwAjv3YU9tztxq8VwhKlFVx0T6qjv63yVmfAm34SBGenElloCsgXxLGzdXJVmmN6t19gPEQm-gnHg8OoGgPYq98v45GAfMZIi5vLPy4cjw9Fp2ui5y0l_Kwgb438pK3ZIyi0d--lEZGbfA2xQE3II4HCyFmhr1lxHBhBeW6JHdwI3A3XfMiccnBtI2T1ngsGBV07BUPH_6qmP83V6', 1, 0, 'Compra Verificada', 5, 'Textura súper ligera, ideal para el calor de Cali', 'grasa', '1 mes', 'Clima cálido húmedo', 'En Cali con la humedad casi todos los sérums me dejaban sensación pesada o pegajosa, pero este se funde al instante. Mis poros se ven notablemente más cerrados y me aguanta intacto todo el día sin sensación oleosa.', 19, NULL, 'Hace 2 semanas');

-- ---------------------------------------------------------------------
-- 15. Personal
-- ---------------------------------------------------------------------
INSERT INTO `personal` (`id`, `usuario_id`, `cargo`, `sede_asignada_id`, `salario_base`, `fecha_ingreso`, `estado`) VALUES
('emp-01', 'usr-admin', 'Director General de Operaciones', 'bogota', 5800000.00, '2024-01-15', 'activo'),
('emp-02', 'usr-empleado', 'Jefe de Bodega y Alistamiento', 'bogota', 2200000.00, '2024-06-01', 'activo');

-- ---------------------------------------------------------------------
-- 16. Configuración del Sistema
-- ---------------------------------------------------------------------
INSERT INTO `configuracion_sistema` (`clave`, `valor`, `descripcion`) VALUES
('app_nombre', 'Belleza en un Clic', 'Nombre de la plataforma de dermocosmética'),
('app_version', '2.0-PHP-Microservices', 'Versión de la arquitectura'),
('dian_iva_porcentaje', '19', 'Tarifa general de IVA en Colombia'),
('dian_resolucion_facturacion', 'RES-DIAN-1876400921', 'Resolución de numeración electrónica DIAN'),
('envio_gratis_monto_minimo', '120000', 'Monto mínimo para envío nacional gratis'),
('notificaciones_email_activo', '1', 'Habilitar notificaciones transaccionales');
