/**
 * Aplicação Principal - Trilho Digital
 * Sistema simplificado de calibração e controle de imagem
 */

class TrilhoApp {
    constructor() {
        this.config = {
            imageUrl: null,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            position: 0, // Posição de rolagem (0-100%)
            imageWidth: 0,
            imageHeight: 0,
            calibrationMode: false,
            calibrationData: null,
            trackRange: { min: 0, max: 1 }, // Range do trilho físico (0-1)
            usefulArea: { min: 0, max: 62.3 } // Área útil da imagem (0-62.3%)
        };
        
        this.isInitialized = false;
        this.udpEnabled = false;
        this.backgroundImage = null;
        this.calibrationImage = 'bg300x200-comtv.jpg';
        
        this.init();
    }
    
    init() {
        console.log('Inicializando Trilho Digital App...');
        
        this.setupEventListeners();
        this.setupUDPClient();
        this.setupRetractablePanel();
        this.loadConfiguration();
        
        this.isInitialized = true;
        console.log('Aplicação inicializada com sucesso!');
    }
    
    setupEventListeners() {
        // Upload de imagem
        const imageUpload = document.getElementById('image-upload');
        imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Controles de calibração - sliders
        this.scaleSlider = document.getElementById('scale-slider');
        this.offsetXSlider = document.getElementById('offset-x');
        this.offsetYSlider = document.getElementById('offset-y');
        this.positionSlider = document.getElementById('position-slider');
        
        this.scaleSlider.addEventListener('input', (e) => this.updateScale(parseFloat(e.target.value)));
        this.offsetXSlider.addEventListener('input', (e) => this.updateOffsetX(parseInt(e.target.value)));
        this.offsetYSlider.addEventListener('input', (e) => this.updateOffsetY(parseInt(e.target.value)));
        this.positionSlider.addEventListener('input', (e) => this.updatePosition(parseFloat(e.target.value)));
        
        // Controles de calibração - campos de entrada
        const scaleInput = document.getElementById('scale-input');
        const offsetXInput = document.getElementById('offset-x-input');
        const offsetYInput = document.getElementById('offset-y-input');
        
        scaleInput.addEventListener('input', (e) => this.updateScale(parseFloat(e.target.value)));
        offsetXInput.addEventListener('input', (e) => this.updateOffsetX(parseInt(e.target.value)));
        offsetYInput.addEventListener('input', (e) => this.updateOffsetY(parseInt(e.target.value)));
        
        // Input de posição
        const positionInput = document.getElementById('position-input');
        if (positionInput) {
            positionInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value >= 0 && value <= 200) {
                    this.updatePosition(value);
                }
            });
        }
        
        // Botões de salvar/carregar
        document.getElementById('save-config').addEventListener('click', () => this.saveConfig());
        document.getElementById('load-config').addEventListener('click', () => this.loadConfig());
        document.getElementById('config-upload').addEventListener('change', (e) => this.handleConfigUpload(e));
    }
    
    setupUDPClient() {
        if (window.udpClient) {
            window.udpClient.onPositionUpdate((position) => {
                this.updatePositionFromUDP(position);
            });
            
            // Atualiza status UDP
            setInterval(() => {
                this.updateUDPStatus();
            }, 1000);
        }
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.config.imageUrl = e.target.result;
            
            // Analisar dimensões reais da imagem
            this.analyzeImageDimensions(e.target.result);
            
            this.updateBackgroundImage();
            this.updateImagePreview();
        };
        reader.readAsDataURL(file);
    }
    
    // Analisar dimensões reais da imagem carregada
    analyzeImageDimensions(imageUrl) {
        const img = new Image();
        img.onload = () => {
            const imageWidth = img.naturalWidth;
            const imageHeight = img.naturalHeight;
            const imageRatio = imageWidth / imageHeight;
            
            console.log('=== ANÁLISE DA IMAGEM CARREGADA ===');
            console.log(`Dimensões da imagem: ${imageWidth}x${imageHeight} pixels`);
            console.log(`Razão da imagem: ${imageRatio.toFixed(3)}`);
            console.log(`Razão 9:16: ${(9/16).toFixed(3)}`);
            
            // Calcular calibração baseada nas dimensões reais
            this.calculateCalibrationFromImage(imageWidth, imageHeight);
        };
        img.src = imageUrl;
    }
    
    // Calcular calibração baseada nas dimensões reais da imagem
    calculateCalibrationFromImage(imageWidth, imageHeight) {
        // Dimensões da tela
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenRatio = screenWidth / screenHeight;
        
        // Razão 9:16
        const targetRatio = 9/16;
        
        console.log('=== CÁLCULO DE CALIBRAÇÃO BASEADO NA IMAGEM ===');
        console.log(`Tela: ${screenWidth}x${screenHeight} (${screenRatio.toFixed(3)})`);
        console.log(`Imagem: ${imageWidth}x${imageHeight} (${(imageWidth/imageHeight).toFixed(3)})`);
        console.log(`Razão 9:16: ${targetRatio.toFixed(3)}`);
        
        // Calcular escala para encaixar a imagem na proporção 9:16
        const imageRatio = imageWidth / imageHeight;
        let scale;
        
        if (imageRatio > targetRatio) {
            // Imagem é mais larga que 9:16, ajustar pela altura
            scale = screenHeight / imageHeight;
        } else {
            // Imagem é mais alta que 9:16, ajustar pela largura
            scale = (screenHeight * targetRatio) / imageWidth;
        }
        
        // Calcular offsets para centralizar
        const scaledWidth = imageWidth * scale;
        const scaledHeight = imageHeight * scale;
        
        const offsetX = (screenWidth - scaledWidth) / 2;
        const offsetY = (screenHeight - scaledHeight) / 2;
        
        console.log(`Escala calculada: ${scale.toFixed(3)}`);
        console.log(`Dimensões escaladas: ${scaledWidth.toFixed(1)}x${scaledHeight.toFixed(1)}`);
        console.log(`Offset X calculado: ${offsetX.toFixed(1)}`);
        console.log(`Offset Y calculado: ${offsetY.toFixed(1)}`);
        
        // Salvar as dimensões da imagem no config
        this.config.imageWidth = imageWidth;
        this.config.imageHeight = imageHeight;
        
        // Aplicar os valores calculados
        this.updateScale(scale);
        this.updateOffsetX(offsetX);
        this.updateOffsetY(offsetY);
        
        console.log('✅ Calibração baseada na imagem aplicada!');
        
        // Salvar os valores calculados para referência
        this.calculatedCalibration = {
            imageWidth,
            imageHeight,
            scale,
            offsetX,
            offsetY,
            screenWidth,
            screenHeight
        };
        
        return {
            scale,
            offsetX,
            offsetY,
            imageWidth,
            imageHeight
        };
    }
    
    updateBackgroundImage() {
        if (!this.config.imageUrl) return;
        
        const backgroundImage = document.getElementById('background-image');
        if (backgroundImage) {
            backgroundImage.style.backgroundImage = `url(${this.config.imageUrl})`;
            backgroundImage.style.backgroundSize = 'cover';
            backgroundImage.style.backgroundPosition = 'center';
            backgroundImage.style.backgroundRepeat = 'no-repeat';
        }
    }
    
    updateImagePreview() {
        const preview = document.getElementById('image-preview');
        if (preview && this.config.imageUrl) {
            preview.innerHTML = `<img src="${this.config.imageUrl}" alt="Preview">`;
        }
    }
    
    updateScale(scale) {
        this.config.scale = scale;
        document.getElementById('scale-value').textContent = scale.toFixed(3);
        
        // Sincroniza slider e campo de entrada
        this.scaleSlider.value = scale;
        document.getElementById('scale-input').value = scale;
        
        this.applyTransform();
    }
    
    updateOffsetX(offsetX) {
        this.config.offsetX = offsetX;
        document.getElementById('offset-x-value').textContent = offsetX.toFixed(1);
        
        // Sincroniza slider e campo de entrada
        this.offsetXSlider.value = offsetX;
        document.getElementById('offset-x-input').value = offsetX;
        
        this.applyTransform();
    }
    
    updateOffsetY(offsetY) {
        this.config.offsetY = offsetY;
        document.getElementById('offset-y-value').textContent = offsetY.toFixed(1);
        
        // Sincroniza slider e campo de entrada
        this.offsetYSlider.value = offsetY;
        document.getElementById('offset-y-input').value = offsetY;
        
        this.applyTransform();
    }
    
    updatePosition(position) {
        try {
            // Arredondar para evitar oscilações
            const roundedPosition = Math.round(position * 10) / 10;
            
            console.log(`🔄 Atualizando posição para: ${roundedPosition}%`);
            
            this.config.position = roundedPosition;
            document.getElementById('position-value').textContent = roundedPosition.toFixed(1) + '%';
            
            // Sincronizar slider e input
            this.positionSlider.value = roundedPosition;
            const positionInput = document.getElementById('position-input');
            if (positionInput) {
                positionInput.value = roundedPosition.toFixed(1);
            }
            
            console.log(`✅ Posição atualizada, aplicando transform...`);
            this.applyTransform();
            console.log(`✅ Transform aplicado com sucesso`);
            
        } catch (error) {
            console.error('❌ ERRO ao atualizar posição:', error);
            console.error('Stack trace:', error.stack);
        }
    }
    
    updatePositionFromUDP(normalizedPosition) {
        // Mapear trilho físico (0-1) para área útil da imagem (0-62.3%)
        const usefulArea = this.config.usefulArea || { min: 0, max: 62.3 };
        const position = usefulArea.min + (normalizedPosition * (usefulArea.max - usefulArea.min));
        
        this.config.position = position;
        
        // Atualiza slider manual
        if (this.positionSlider) {
            this.positionSlider.value = position;
        }
        
        document.getElementById('position-value').textContent = position.toFixed(1) + '%';
        this.applyTransform();
        this.updatePositionDisplay();
        
        console.log(`🎯 UDP: Trilho ${normalizedPosition.toFixed(3)} → Posição ${position.toFixed(1)}%`);
    }
    
    applyTransform() {
        try {
            console.log(`🎯 Aplicando transform...`);
            
            const backgroundImage = document.getElementById('background-image');
            if (!backgroundImage) {
                console.error('❌ Elemento background-image não encontrado!');
                return;
            }
            
            const scale = this.config.scale;
            const offsetX = this.config.offsetX;
            const offsetY = this.config.offsetY;
            const position = this.config.position;
            
            console.log(`📊 Valores: scale=${scale}, offsetX=${offsetX}, offsetY=${offsetY}, position=${position}%`);
        
        // Calcular dimensões da imagem escalada
        const imageWidth = this.config.imageWidth || 1920; // Usar dimensões reais se disponível
        const imageHeight = this.config.imageHeight || 1080;
        const scaledWidth = imageWidth * scale;
        const scaledHeight = imageHeight * scale;
        
        // Calcular o range de movimento baseado no tamanho real da imagem
        // A imagem deve se mover da posição atual até mostrar o final
        let maxMovement;
        if (scaledWidth > window.innerWidth) {
            // Se a imagem é maior que a tela, pode se mover para mostrar o final
            maxMovement = scaledWidth - window.innerWidth;
        } else {
            // Se a imagem é menor que a tela, usar um valor fixo baseado no offset
            // para evitar oscilações
            maxMovement = Math.abs(offsetX) * 0.5; // Reduzir o movimento para estabilizar
        }
        
        const horizontalOffset = (position / 100) * maxMovement;
        
        // Debug do movimento
        if (position > 0) {
            console.log(`=== DEBUG MOVIMENTO ===`);
            console.log(`Dimensões da imagem: ${imageWidth}x${imageHeight}`);
            console.log(`Dimensões escaladas: ${scaledWidth.toFixed(1)}x${scaledHeight.toFixed(1)}`);
            console.log(`Tela: ${window.innerWidth}x${window.innerHeight}`);
            console.log(`Movimento máximo: ${maxMovement.toFixed(1)}px`);
            console.log(`Movimento horizontal: ${horizontalOffset.toFixed(1)}px`);
            console.log(`Posição: ${position}%`);
            console.log(`Offset X original: ${offsetX}`);
            console.log(`Offset X final: ${offsetX - horizontalOffset}`);
            console.log(`Posição final da imagem: X=${offsetX - horizontalOffset}, Y=${offsetY}`);
        }
        
        // Aplica todas as transformações
        const transform = `translate(${offsetX - horizontalOffset}px, ${offsetY}px) scale(${scale})`;
        console.log(`🎨 Aplicando transform: ${transform}`);
        backgroundImage.style.transform = transform;
        console.log(`✅ Transform aplicado com sucesso`);
        
        } catch (error) {
            console.error('❌ ERRO ao aplicar transform:', error);
            console.error('Stack trace:', error.stack);
            console.error('Config atual:', this.config);
        }
    }
    
    updatePositionDisplay() {
        const currentPosition = document.getElementById('current-position');
        const encoderValue = document.getElementById('encoder-value');
        
        if (currentPosition) {
            // Converte porcentagem para centímetros (assumindo trilho de 300cm)
            const centimeters = (this.config.position / 100) * 300;
            currentPosition.textContent = centimeters.toFixed(2);
        }
        
        if (encoderValue) {
            encoderValue.textContent = (this.config.position / 100).toFixed(2);
        }
    }
    
    updateUDPStatus() {
        const udpStatus = document.getElementById('udp-status');
        if (udpStatus && window.udpClient) {
            const isConnected = window.udpClient.isConnectedToEncoder();
            if (window.udpClient.mockMode) {
                udpStatus.textContent = 'Modo Mock';
                udpStatus.style.color = '#ffaa00';
            } else {
                udpStatus.textContent = isConnected ? 'Conectado' : 'Desconectado';
                udpStatus.style.color = isConnected ? '#00ff00' : '#ff0000';
            }
        }
    }
    
    // Funções de controle rápido
    resetCalibration() {
        this.updateScale(1.0);
        this.updateOffsetX(0);
        this.updateOffsetY(0);
        this.updatePosition(0);
    }
    
    centerImage() {
        this.updateOffsetX(0);
        this.updateOffsetY(0);
    }
    
    fitToScreen() {
        // Ajusta a escala para preencher a tela
        this.updateScale(1.0);
        this.centerImage();
    }
    
    // Calibração para imagem 300cm x 200cm, 144 DPI
    calibrateFor300x200() {
        // Valores otimizados para imagem 300cm x 200cm, 144 DPI
        this.updateScale(0.274);
        this.updateOffsetX(-3991);
        this.updateOffsetY(-3019);
        this.updatePosition(0);
        console.log('Calibração aplicada para imagem 300cm x 200cm, 144 DPI');
    }
    
    // Análise da razão dos valores de calibração
    analyzeCalibrationRatio() {
        const offsetX = -3991;
        const offsetY = -3019;
        const imageWidth = 300;
        const imageHeight = 200;
        
        const ratioXY = offsetX / offsetY;
        const ratioDimensions = imageWidth / imageHeight;
        
        console.log('=== ANÁLISE DA RAZÃO DE CALIBRAÇÃO ===');
        console.log(`Offset X: ${offsetX}`);
        console.log(`Offset Y: ${offsetY}`);
        console.log(`Razão X/Y: ${ratioXY.toFixed(6)}`);
        console.log(`Razão dimensões (300/200): ${ratioDimensions.toFixed(6)}`);
        console.log(`Diferença: ${Math.abs(ratioXY - ratioDimensions).toFixed(6)}`);
        
        // Calcular valores mais exatos baseados na razão 3:2
        const exactOffsetX = offsetY * ratioDimensions;
        console.log(`Para manter 3:2, X deveria ser: ${exactOffsetX.toFixed(1)}`);
        console.log(`Diferença atual: ${Math.abs(offsetX - exactOffsetX).toFixed(1)}`);
        
        return {
            currentRatio: ratioXY,
            dimensionRatio: ratioDimensions,
            difference: Math.abs(ratioXY - ratioDimensions),
            exactOffsetX: exactOffsetX
        };
    }
    
    // Calibração masterizada para diferentes dimensões de trilho
    calculateRedArea916() {
        console.log('=== CALIBRAÇÃO MASTERIZADA PARA DIFERENTES TRILHOS ===');
        
        // Dimensões da tela atual
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenRatio = screenWidth / screenHeight;
        
        // Valores base que funcionam (1080x1920)
        const baseScale = 0.542;
        const baseOffsetX = -2593;
        const baseOffsetY = -2272;
        const baseScreenWidth = 1080;
        const baseScreenHeight = 1920;
        
        // Proporções base (valores absolutos)
        const offsetXRatio = baseOffsetX / baseScreenWidth; // -2.401
        const offsetYRatio = baseOffsetY / baseScreenHeight; // -1.183
        const maxPosition = 390; // Posição máxima real
        
        console.log(`Tela atual: ${screenWidth}x${screenHeight} (${screenRatio.toFixed(3)})`);
        console.log(`Proporções base: X=${offsetXRatio.toFixed(3)}, Y=${offsetYRatio.toFixed(3)}`);
        console.log(`Posição máxima: ${maxPosition}%`);
        
        // Calcular valores para a tela atual
        const scale = baseScale; // Escala fixa
        const offsetX = screenWidth * offsetXRatio;
        const offsetY = screenHeight * offsetYRatio;
        
        console.log(`Escala: ${scale} (fixa)`);
        console.log(`Offset X: ${offsetX.toFixed(1)} (${offsetXRatio.toFixed(3)} da largura)`);
        console.log(`Offset Y: ${offsetY.toFixed(1)} (${offsetYRatio.toFixed(3)} da altura)`);
        
        // Aplicar os valores calculados
        this.updateScale(scale);
        this.updateOffsetX(offsetX);
        this.updateOffsetY(offsetY);
        
        console.log('✅ Calibração masterizada aplicada!');
        
        return {
            scale,
            offsetX,
            offsetY,
            offsetXRatio,
            offsetYRatio,
            maxPosition,
            screenWidth,
            screenHeight
        };
    }
    
    // Calibração para trilho específico
    calibrateForTrack(trackWidth, trackHeight, dpi = 15) {
        console.log(`=== CALIBRAÇÃO PARA TRILHO ${trackWidth}cm x ${trackHeight}cm ===`);
        
        // Dimensões da tela atual
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Proporções base (valores absolutos)
        const offsetXRatio = -2.401; // -2593/1080
        const offsetYRatio = -1.183; // -2272/1920
        const baseScale = 0.542;
        const maxPosition = 390;
        
        // Calcular escala baseada no DPI
        const scaleRatio = dpi / 15; // 15 DPI é o valor base
        const scale = baseScale * scaleRatio;
        
        // Calcular offsets baseados nas proporções
        const offsetX = screenWidth * offsetXRatio;
        const offsetY = screenHeight * offsetYRatio;
        
        console.log(`Trilho: ${trackWidth}cm x ${trackHeight}cm, DPI: ${dpi}`);
        console.log(`Escala: ${scale.toFixed(3)} (base: ${baseScale} x ${scaleRatio.toFixed(3)})`);
        console.log(`Offset X: ${offsetX.toFixed(1)}`);
        console.log(`Offset Y: ${offsetY.toFixed(1)}`);
        console.log(`Posição máxima: ${maxPosition}%`);
        
        // Aplicar os valores calculados
        this.updateScale(scale);
        this.updateOffsetX(offsetX);
        this.updateOffsetY(offsetY);
        
        console.log('✅ Calibração para trilho específico aplicada!');
        
        return {
            trackWidth,
            trackHeight,
            dpi,
            scale,
            offsetX,
            offsetY,
            maxPosition
        };
    }
    
    // Aplicar valores exatos que funcionaram
    applyExactWorkingValues() {
        console.log('=== APLICANDO VALORES EXATOS QUE FUNCIONARAM ===');
        
        // Verificar se há imagem carregada
        if (!this.config.imageUrl) {
            console.log('❌ Nenhuma imagem carregada! Carregue uma imagem primeiro.');
            return;
        }
        
        // Valores exatos que funcionaram na resolução 1080x1920
        const exactScale = 0.542;
        const exactOffsetX = -2593;
        const exactOffsetY = -2272;
        
        console.log(`Aplicando valores exatos:`);
        console.log(`Escala: ${exactScale}`);
        console.log(`Offset X: ${exactOffsetX}`);
        console.log(`Offset Y: ${exactOffsetY}`);
        console.log(`Tela atual: ${window.innerWidth}x${window.innerHeight}`);
        
        // Aplicar os valores exatos
        this.updateScale(exactScale);
        this.updateOffsetX(exactOffsetX);
        this.updateOffsetY(exactOffsetY);
        
        // Debug da posição da imagem
        const imageWidth = this.config.imageWidth || 1920;
        const imageHeight = this.config.imageHeight || 1080;
        const scaledWidth = imageWidth * exactScale;
        const scaledHeight = imageHeight * exactScale;
        
        console.log(`Dimensões da imagem: ${imageWidth}x${imageHeight}`);
        console.log(`Dimensões escaladas: ${scaledWidth.toFixed(1)}x${scaledHeight.toFixed(1)}`);
        console.log(`Posição da imagem: X=${exactOffsetX} a ${exactOffsetX + scaledWidth.toFixed(1)}`);
        console.log(`Imagem visível? ${exactOffsetX < 0 && exactOffsetX + scaledWidth > 0}`);
        
        console.log('✅ Valores exatos aplicados!');
        
        return {
            scale: exactScale,
            offsetX: exactOffsetX,
            offsetY: exactOffsetY
        };
    }
    
    // Verificar status da imagem e calibração
    checkImageStatus() {
        console.log('=== VERIFICAÇÃO DE STATUS ===');
        
        // Status da imagem
        console.log(`Imagem carregada: ${this.config.imageUrl ? '✅ Sim' : '❌ Não'}`);
        if (this.config.imageUrl) {
            console.log(`URL da imagem: ${this.config.imageUrl.substring(0, 50)}...`);
        }
        
        // Dimensões
        const imageWidth = this.config.imageWidth || 1920;
        const imageHeight = this.config.imageHeight || 1080;
        console.log(`Dimensões da imagem: ${imageWidth}x${imageHeight}`);
        
        // Configuração atual
        console.log(`Escala: ${this.config.scale}`);
        console.log(`Offset X: ${this.config.offsetX}`);
        console.log(`Offset Y: ${this.config.offsetY}`);
        console.log(`Posição: ${this.config.position}%`);
        
        // Dimensões escaladas
        const scaledWidth = imageWidth * this.config.scale;
        const scaledHeight = imageHeight * this.config.scale;
        console.log(`Dimensões escaladas: ${scaledWidth.toFixed(1)}x${scaledHeight.toFixed(1)}`);
        
        // Posição da imagem
        const imageLeft = this.config.offsetX;
        const imageRight = imageLeft + scaledWidth;
        const imageTop = this.config.offsetY;
        const imageBottom = imageTop + scaledHeight;
        
        console.log(`Posição da imagem:`);
        console.log(`  X: ${imageLeft.toFixed(1)} a ${imageRight.toFixed(1)}`);
        console.log(`  Y: ${imageTop.toFixed(1)} a ${imageBottom.toFixed(1)}`);
        
        // Visibilidade
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isVisibleX = imageLeft < screenWidth && imageRight > 0;
        const isVisibleY = imageTop < screenHeight && imageBottom > 0;
        
        console.log(`Tela: ${screenWidth}x${screenHeight}`);
        console.log(`Visível X: ${isVisibleX ? '✅ Sim' : '❌ Não'}`);
        console.log(`Visível Y: ${isVisibleY ? '✅ Sim' : '❌ Não'}`);
        
        // Elemento da imagem
        if (this.backgroundImage) {
            console.log(`Elemento da imagem: ✅ Encontrado`);
            console.log(`Transform atual: ${this.backgroundImage.style.transform}`);
        } else {
            console.log(`Elemento da imagem: ❌ Não encontrado`);
        }
        
        console.log('=== FIM DA VERIFICAÇÃO ===');
    }
    
    // Testar movimentação horizontal
    testHorizontalMovement() {
        console.log('=== TESTE DE MOVIMENTAÇÃO HORIZONTAL (0-200%) ===');
        
        // Testar diferentes posições com fator correto
        const positions = [0, 25, 50, 75, 100, 125, 150, 175, 200];
        
        positions.forEach((pos, index) => {
            setTimeout(() => {
                console.log(`Testando posição ${pos}%...`);
                this.updatePosition(pos);
            }, index * 800);
        });
        
        console.log('Teste iniciado - observe a movimentação da imagem');
        console.log('50% deve ir para a borda, 100% para 2x a borda');
    }
    
    // Análise do por que funcionou
    analyzeWhyItWorked() {
        console.log('=== ANÁLISE DO POR QUE FUNCIONOU (1080x1920) ===');
        
        // Valores que funcionaram na resolução 1080x1920
        const workingScale = 0.542;
        const workingOffsetX = -2593;
        const workingOffsetY = -2272;
        
        // Dimensões da tela
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        console.log(`Tela atual: ${screenWidth}x${screenHeight}`);
        console.log(`Tela de referência: 1080x1920`);
        console.log(`Escala: ${workingScale}`);
        console.log(`Offset X: ${workingOffsetX} (${(workingOffsetX/1080*100).toFixed(1)}% da largura)`);
        console.log(`Offset Y: ${workingOffsetY} (${(workingOffsetY/1920*100).toFixed(1)}% da altura)`);
        
        // Calcular posição real da imagem
        const imageWidth = 1920; // Dimensões da imagem original
        const imageHeight = 1080;
        const scaledWidth = imageWidth * workingScale;
        const scaledHeight = imageHeight * workingScale;
        
        const actualX = workingOffsetX;
        const actualY = workingOffsetY;
        const actualRight = actualX + scaledWidth;
        const actualBottom = actualY + scaledHeight;
        
        console.log(`Imagem original: ${imageWidth}x${imageHeight}`);
        console.log(`Imagem escalada: ${scaledWidth.toFixed(1)}x${scaledHeight.toFixed(1)}`);
        console.log(`Posição real: X=${actualX.toFixed(1)}, Y=${actualY.toFixed(1)}`);
        console.log(`Fim real: X=${actualRight.toFixed(1)}, Y=${actualBottom.toFixed(1)}`);
        console.log(`Cobre tela 1080x1920: ${actualX <= 0 && actualY <= 0 && actualRight >= 1080 && actualBottom >= 1920}`);
        
        // Calcular razões
        const ratioXY = workingOffsetX / workingOffsetY;
        const ratio916 = 9/16;
        
        console.log(`Razão X/Y: ${ratioXY.toFixed(6)}`);
        console.log(`Razão 9:16: ${ratio916.toFixed(6)}`);
        console.log(`Diferença: ${Math.abs(ratioXY - ratio916).toFixed(6)}`);
        
        return {
            screenWidth,
            screenHeight,
            scale: workingScale,
            offsetX: workingOffsetX,
            offsetY: workingOffsetY,
            scaledWidth,
            scaledHeight,
            actualX,
            actualY,
            actualRight,
            actualBottom,
            ratioXY,
            ratio916
        };
    }
    
    // Calibração inteligente baseada em ajustes incrementais
    smartCalibration() {
        // Valores base que funcionam
        const baseScale = 0.332;
        const baseOffsetX = -3614;
        const baseOffsetY = -2856;
        
        // Dimensões da tela atual
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenRatio = screenWidth / screenHeight;
        
        // Razão 9:16
        const targetRatio = 9/16;
        
        console.log('=== CALIBRAÇÃO INTELIGENTE ===');
        console.log(`Tela: ${screenWidth}x${screenHeight} (${screenRatio.toFixed(3)})`);
        console.log(`Razão 9:16: ${targetRatio.toFixed(3)}`);
        
        // Calcular ajustes baseados na diferença de proporção
        const ratioDifference = screenRatio - targetRatio;
        const scaleAdjustment = 1 + (ratioDifference * 0.1); // Ajuste suave
        const xAdjustment = ratioDifference * 100; // Ajuste proporcional
        const yAdjustment = ratioDifference * 50;
        
        const newScale = baseScale * scaleAdjustment;
        const newOffsetX = baseOffsetX + xAdjustment;
        const newOffsetY = baseOffsetY + yAdjustment;
        
        console.log(`Ajustes calculados:`);
        console.log(`Escala: ${baseScale} → ${newScale.toFixed(3)}`);
        console.log(`Offset X: ${baseOffsetX} → ${newOffsetX.toFixed(1)}`);
        console.log(`Offset Y: ${baseOffsetY} → ${newOffsetY.toFixed(1)}`);
        
        // Aplicar os valores calculados
        this.updateScale(newScale);
        this.updateOffsetX(newOffsetX);
        this.updateOffsetY(newOffsetY);
        
        console.log('✅ Calibração inteligente aplicada!');
        
        return {
            scale: newScale,
            offsetX: newOffsetX,
            offsetY: newOffsetY,
            adjustments: {
                scale: scaleAdjustment,
                x: xAdjustment,
                y: yAdjustment
            }
        };
    }
    
    // Calibração automática baseada nas dimensões da imagem
    autoCalibrate(imageWidth, imageHeight, dpi = 144) {
        // Valores base para imagem 300cm x 200cm, 144 DPI
        const baseScale = 0.274;
        const baseOffsetX = -3991;
        const baseOffsetY = -3019;
        const baseWidth = 300;
        const baseHeight = 200;
        const baseDpi = 144;
        
        // Calcula razões de proporção
        const widthRatio = imageWidth / baseWidth;
        const heightRatio = imageHeight / baseHeight;
        const dpiRatio = dpi / baseDpi;
        
        // Aplica as razões aos valores base
        const calculatedScale = baseScale * dpiRatio;
        const calculatedOffsetX = baseOffsetX * widthRatio;
        const calculatedOffsetY = baseOffsetY * heightRatio;
        
        // Aplica os valores calculados
        this.updateScale(calculatedScale);
        this.updateOffsetX(calculatedOffsetX);
        this.updateOffsetY(calculatedOffsetY);
        this.updatePosition(0);
        
        console.log(`Calibração automática aplicada:`, {
            dimensoes: `${imageWidth}cm x ${imageHeight}cm`,
            dpi: dpi,
            escala: calculatedScale.toFixed(3),
            offsetX: calculatedOffsetX.toFixed(1),
            offsetY: calculatedOffsetY.toFixed(1),
            razoes: {
                largura: widthRatio.toFixed(3),
                altura: heightRatio.toFixed(3),
                dpi: dpiRatio.toFixed(3)
            }
        });
    }
    
    setPosition(position) {
        this.updatePosition(position);
    }
    
    // Salvar/Carregar configuração
    saveConfig() {
        const configData = {
            ...this.config,
            timestamp: new Date().toISOString(),
            version: '2.0'
        };
        
        const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `trilho-calibracao-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Salva também no localStorage
        localStorage.setItem('trilho-calibracao', JSON.stringify(configData));
        
        console.log('Configuração salva:', configData);
    }
    
    loadConfig() {
        document.getElementById('config-upload').click();
    }
    
    handleConfigUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const configData = JSON.parse(e.target.result);
                this.loadConfigData(configData);
            } catch (error) {
                console.error('Erro ao carregar configuração:', error);
                alert('Erro ao carregar arquivo de configuração');
            }
        };
        reader.readAsText(file);
    }
    
    loadConfiguration() {
        const saved = localStorage.getItem('trilho-calibracao');
        if (saved) {
            try {
                const configData = JSON.parse(saved);
                this.loadConfigData(configData);
            } catch (error) {
                console.error('Erro ao carregar configuração salva:', error);
            }
        }
    }
    
    loadConfigData(configData) {
        this.config.scale = configData.scale || 1.0;
        this.config.offsetX = configData.offsetX || 0;
        this.config.offsetY = configData.offsetY || 0;
        this.config.position = configData.position || 0;
        
        if (configData.imageUrl) {
            this.config.imageUrl = configData.imageUrl;
            this.updateBackgroundImage();
            this.updateImagePreview();
        }
        
        this.updateDisplay();
        console.log('Configuração carregada:', configData);
    }
    
    updateDisplay() {
        // Atualiza todos os controles com os valores atuais
        document.getElementById('scale-slider').value = this.config.scale;
        document.getElementById('scale-input').value = this.config.scale;
        document.getElementById('scale-value').textContent = this.config.scale.toFixed(2);
        
        document.getElementById('offset-x').value = this.config.offsetX;
        document.getElementById('offset-x-input').value = this.config.offsetX;
        document.getElementById('offset-x-value').textContent = this.config.offsetX;
        
        document.getElementById('offset-y').value = this.config.offsetY;
        document.getElementById('offset-y-input').value = this.config.offsetY;
        document.getElementById('offset-y-value').textContent = this.config.offsetY;
        
        document.getElementById('position-slider').value = this.config.position;
        document.getElementById('position-value').textContent = this.config.position.toFixed(1) + '%';
        
        this.applyTransform();
        this.updatePositionDisplay();
    }
    
    // Funções para botões de incremento/decremento
    adjustScale(delta) {
        const newScale = Math.max(0.1, Math.min(3, this.config.scale + delta));
        this.updateScale(newScale);
    }
    
    adjustOffsetX(delta) {
        const newOffsetX = Math.max(-3500, Math.min(3500, this.config.offsetX + delta));
        this.updateOffsetX(newOffsetX);
    }
    
    adjustOffsetY(delta) {
        const newOffsetY = Math.max(-3500, Math.min(3500, this.config.offsetY + delta));
        this.updateOffsetY(newOffsetY);
    }
    
    // Controle do painel flutuante
    setupRetractablePanel() {
        const panel = document.getElementById('control-panel');
        const toggleButton = document.getElementById('toggle-panel');
        const panelHeader = panel.querySelector('.panel-header');
        
        // Toggle do painel
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('collapsed');
            const isCollapsed = panel.classList.contains('collapsed');
            toggleButton.textContent = isCollapsed ? '▶' : '◀';
        });
        
        // Drag and drop do painel - versão simplificada
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialX = 0;
        let initialY = 0;
        
        // Mousedown no header
        panelHeader.addEventListener('mousedown', (e) => {
            // Não arrastar se clicou no botão toggle
            if (e.target === toggleButton || e.target.closest('.toggle-panel')) {
                return;
            }
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            // Salva posição inicial
            const rect = panel.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            panel.classList.add('dragging');
            panel.style.position = 'fixed';
            panel.style.left = initialX + 'px';
            panel.style.top = initialY + 'px';
            panel.style.zIndex = '1001';
            
            e.preventDefault();
        });
        
        // Mousemove no document
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newX = initialX + deltaX;
            let newY = initialY + deltaY;
            
            // Limita dentro da tela
            const panelWidth = panel.classList.contains('collapsed') ? 50 : 250;
            newX = Math.max(10, Math.min(window.innerWidth - panelWidth - 10, newX));
            newY = Math.max(10, Math.min(window.innerHeight - 100, newY));
            
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
        });
        
        // Mouseup no document
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            isDragging = false;
            panel.classList.remove('dragging');
        });
        
        // Auto-recolher desabilitado - menu fica sempre visível quando expandido
    }

    // Modo de Calibração
    enableCalibrationMode() {
        console.log('🎯 Modo de calibração ativado');
        this.config.calibrationMode = true;
        this.loadCalibrationImage();
    }

    disableCalibrationMode() {
        console.log('📱 Modo de uso ativado');
        this.config.calibrationMode = false;
    }

    loadCalibrationImage() {
        console.log('🖼️ Carregando imagem de calibração...');
        
        // Carregar a imagem de calibração
        const imageUrl = this.calibrationImage;
        this.config.imageUrl = imageUrl;
        
        // Atualizar a imagem de fundo
        const backgroundImage = document.getElementById('background-image');
        if (backgroundImage) {
            backgroundImage.src = imageUrl;
            backgroundImage.onload = () => {
                console.log('✅ Imagem de calibração carregada');
                this.autoCalibrateFromImage();
            };
        }
    }

    autoCalibrateFromImage() {
        console.log('🔧 Iniciando calibração automática...');
        
        // Valores conhecidos que funcionam para a imagem de calibração
        const workingValues = {
            scale: 0.542,
            offsetX: -2593,
            offsetY: -2272
        };
        
        // Aplicar valores conhecidos
        this.config.scale = workingValues.scale;
        this.config.offsetX = workingValues.offsetX;
        this.config.offsetY = workingValues.offsetY;
        
        // Atualizar controles
        this.updateScale(workingValues.scale);
        this.updateOffsetX(workingValues.offsetX);
        this.updateOffsetY(workingValues.offsetY);
        
        // Salvar dados de calibração
        this.config.calibrationData = {
            ...workingValues,
            imageUrl: this.calibrationImage,
            timestamp: new Date().toISOString(),
            usefulArea: this.config.usefulArea
        };
        
        console.log('✅ Calibração automática concluída');
        console.log('📊 Valores aplicados:', workingValues);
    }

    saveCalibration() {
        if (!this.config.calibrationData) {
            console.error('❌ Nenhuma calibração para salvar');
            return;
        }
        
        console.log('💾 Salvando calibração...');
        
        // Salvar no localStorage
        localStorage.setItem('trilho_calibration', JSON.stringify(this.config.calibrationData));
        
        // Salvar arquivo JSON
        const dataStr = JSON.stringify(this.config.calibrationData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'calibracao_trilho.json';
        link.click();
        
        URL.revokeObjectURL(url);
        
        console.log('✅ Calibração salva com sucesso');
    }

    loadCalibration() {
        console.log('📂 Carregando calibração...');
        
        // Tentar carregar do localStorage primeiro
        const saved = localStorage.getItem('trilho_calibration');
        if (saved) {
            try {
                const calibrationData = JSON.parse(saved);
                this.applyCalibrationData(calibrationData);
                console.log('✅ Calibração carregada do localStorage');
                return;
            } catch (error) {
                console.error('❌ Erro ao carregar calibração:', error);
            }
        }
        
        // Se não encontrou no localStorage, abrir seletor de arquivo
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const calibrationData = JSON.parse(e.target.result);
                        this.applyCalibrationData(calibrationData);
                        console.log('✅ Calibração carregada do arquivo');
                    } catch (error) {
                        console.error('❌ Erro ao carregar arquivo:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    applyCalibrationData(calibrationData) {
        this.config.calibrationData = calibrationData;
        
        // Aplicar valores de calibração
        if (calibrationData.scale) this.config.scale = calibrationData.scale;
        if (calibrationData.offsetX) this.config.offsetX = calibrationData.offsetX;
        if (calibrationData.offsetY) this.config.offsetY = calibrationData.offsetY;
        if (calibrationData.usefulArea) this.config.usefulArea = calibrationData.usefulArea;
        
        // Atualizar controles
        this.updateScale(this.config.scale);
        this.updateOffsetX(this.config.offsetX);
        this.updateOffsetY(this.config.offsetY);
        
        // Carregar imagem se especificada
        if (calibrationData.imageUrl) {
            this.config.imageUrl = calibrationData.imageUrl;
            const backgroundImage = document.getElementById('background-image');
            if (backgroundImage) {
                backgroundImage.src = calibrationData.imageUrl;
            }
        }
        
        console.log('✅ Dados de calibração aplicados:', calibrationData);
    }

}

// Inicialização simples
console.log('🔍 Script app.js carregado');
console.log('🔍 Document readyState:', document.readyState);

// Aguardar DOM estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    console.log('🚀 Inicializando TrilhoApp...');
    try {
        window.trilhoApp = new TrilhoApp();
        console.log('✅ TrilhoApp inicializado:', window.trilhoApp);
        console.log('✅ Tipo:', typeof window.trilhoApp);
    } catch (error) {
        console.error('❌ Erro ao inicializar TrilhoApp:', error);
    }
}

// Funções globais para os botões
window.resetCalibration = () => window.trilhoApp.resetCalibration();
window.centerImage = () => window.trilhoApp.centerImage();
window.fitToScreen = () => window.trilhoApp.fitToScreen();
window.setPosition = (pos) => window.trilhoApp.setPosition(pos);

// Funções para botões de incremento/decremento
window.adjustScale = (delta) => window.trilhoApp.adjustScale(delta);
window.adjustOffsetX = (delta) => window.trilhoApp.adjustOffsetX(delta);
window.adjustOffsetY = (delta) => window.trilhoApp.adjustOffsetY(delta);

// Funções de calibração
window.calculateRedArea916 = () => window.trilhoApp.calculateRedArea916();
window.applyExactWorkingValues = () => window.trilhoApp.applyExactWorkingValues();
window.testHorizontalMovement = () => window.trilhoApp.testHorizontalMovement();
window.checkImageStatus = () => window.trilhoApp.checkImageStatus();
    window.clearConsole = () => {
        console.clear();
        console.log('🧹 Console limpo!');
    };

    // Função para definir posição exata
    window.setExactPosition = (position) => {
        if (window.trilhoApp) {
            window.trilhoApp.updatePosition(position);
            console.log(`🎯 Posição definida para: ${position}%`);
        }
    };

// Funções de modo de calibração
window.enableCalibrationMode = () => {
    console.log('🔍 enableCalibrationMode chamada');
    if (window.trilhoApp) {
        console.log('✅ trilhoApp encontrado, executando...');
        window.trilhoApp.enableCalibrationMode();
    } else {
        console.error('❌ trilhoApp não encontrado!');
    }
};

window.disableCalibrationMode = () => {
    if (window.trilhoApp) {
        window.trilhoApp.disableCalibrationMode();
    }
};

window.autoCalibrateFromImage = () => {
    if (window.trilhoApp) {
        window.trilhoApp.autoCalibrateFromImage();
    }
};

window.saveCalibration = () => {
    if (window.trilhoApp) {
        window.trilhoApp.saveCalibration();
    }
};

window.loadCalibration = () => {
    if (window.trilhoApp) {
        window.trilhoApp.loadCalibration();
    }
};
window.analyzeWhyItWorked = () => window.trilhoApp.analyzeWhyItWorked();
window.calibrateForTrack = (width, height, dpi) => window.trilhoApp.calibrateForTrack(width, height, dpi);
window.recalculateFromImage = () => {
    if (window.trilhoApp.config.imageUrl) {
        window.trilhoApp.analyzeImageDimensions(window.trilhoApp.config.imageUrl);
    } else {
        console.log('❌ Nenhuma imagem carregada!');
    }
};

// Funções de salvar/carregar
window.saveConfig = () => window.trilhoApp.saveConfig();
window.loadConfig = () => window.trilhoApp.loadConfig();

// Exporta para uso global
window.TrilhoApp = TrilhoApp;
