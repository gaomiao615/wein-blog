'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode, Html5QrcodeScanType, Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useI18n } from '@/lib/i18n/context';
import { searchWineByName, searchWineByCode } from '@/lib/wines/data';
import type { Wine } from '@/lib/wines/data';
import { WineSearchZXing } from './WineSearchZXing';

interface WineSearchProps {
  onWineSelect?: (wine: Wine) => void;
}

export function WineSearch({ onWineSelect }: WineSearchProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Wine[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanStatus, setScanStatus] = useState<string>('');
  const [useZXing, setUseZXing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // 文本搜索
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = searchWineByName(searchQuery, locale as 'en' | 'de' | 'zh');
    setSearchResults(results);
  };

  // 处理回车搜索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 开始扫描二维码
  const startQRScan = async () => {
    // 先显示相机界面
    setShowCamera(true);
    setCameraError(null);
    setIsScanning(true);

    try {
      // 确保容器存在
      const elementId = 'qr-reader';
      let element = document.getElementById(elementId);
      if (!element) {
        // 如果元素不存在，等待一下再试
        await new Promise(resolve => setTimeout(resolve, 100));
        element = document.getElementById(elementId);
      }

      if (!element) {
        throw new Error('Scanner container not found');
      }

      // 如果已有扫描器在运行，先停止
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
        } catch (e) {
          // 忽略停止错误
        }
      }

      const html5QrCode = new Html5Qrcode(elementId);
      scannerRef.current = html5QrCode;

      // 尝试使用后置摄像头，如果失败则使用默认
      let cameraIdOrConfig: string | { facingMode: string } = { facingMode: 'environment' };
      
      try {
        // 尝试获取设备列表
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          // 优先使用后置摄像头
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          cameraIdOrConfig = backCamera?.id || devices[0].id;
        }
      } catch (e) {
        // 如果无法获取设备列表，使用默认配置
        console.log('Could not get camera list, using default');
      }

      // 使用最简化的配置，提高兼容性和识别率
      const config = {
        fps: 10,
        // 使用全屏扫描，支持识别小二维码
        qrbox: function(viewfinderWidth: number, viewfinderHeight: number) {
          // 使用整个视图区域，不限制大小
          return {
            width: viewfinderWidth,
            height: viewfinderHeight
          };
        },
        aspectRatio: 1.0,
        disableFlip: false,
        // 只支持二维码，简化配置
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
      };

      // 成功回调 - 添加防抖，避免重复触发
      let lastScannedCode = '';
      let lastScanTime = 0;
      const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
        const now = Date.now();
        // 防抖：如果1秒内扫描到相同代码，忽略
        if (decodedText === lastScannedCode && now - lastScanTime < 1000) {
          return;
        }
        
        lastScannedCode = decodedText;
        lastScanTime = now;
        
        // 找到二维码或条形码内容
        console.log('✅✅✅ SCANNED CODE:', decodedText);
        console.log('Full decoded result:', decodedResult);
        setScannedCode(decodedText);
        setScanStatus(`✅ Scanned: ${decodedText}`);
        
        // 立即显示扫描结果，即使不在数据库中
        const wine = searchWineByCode(decodedText);
        if (wine) {
          console.log('✅✅✅ WINE FOUND:', wine.name);
          setScanStatus(`✅ Found: ${wine.name} - Redirecting...`);
          // 延迟一下让用户看到结果
          setTimeout(() => {
            stopScanning();
            if (onWineSelect) {
              onWineSelect(wine);
            } else {
              router.push(`/wines/${wine.id}`);
            }
          }, 500);
        } else {
          // 扫描到代码但未找到匹配的酒
          console.log('⚠️⚠️⚠️ CODE SCANNED BUT NOT IN DATABASE:', decodedText);
          setScanStatus(`⚠️ Scanned: ${decodedText} (Not in database)`);
          // 不停止扫描，让用户继续尝试或手动输入
          // 但显示一个明显的提示
        }
      };

      // 错误回调 - 添加更详细的日志
      let errorCount = 0;
      const qrCodeErrorCallback = (errorMessage: string) => {
        errorCount++;
        // 每50次错误显示一次状态
        if (errorCount % 50 === 0) {
          console.log(`🔍 Scanning... (${errorCount} attempts)`);
          setScanStatus(`Scanning... (${errorCount} attempts)`);
        }
        
        // 记录所有错误类型以便调试
        if (errorCount <= 5 || errorCount % 200 === 0) {
          console.log(`Error #${errorCount}:`, errorMessage);
        }
        
        // 检查是否是严重错误（但 NotFoundError 在扫描中是正常的）
        if (errorMessage.includes('Permission') || 
            errorMessage.includes('NotAllowedError')) {
          console.error('❌ Critical error:', errorMessage);
          setCameraError(errorMessage);
          setIsScanning(false);
        }
        
        // 每500次尝试显示一次详细状态
        if (errorCount % 500 === 0) {
          console.log(`⚠️ ${errorCount} attempts - Still scanning. Check:`);
          console.log('  1. QR code is clear and well-lit');
          console.log('  2. QR code is within the scanning frame');
          console.log('  3. Camera is in focus');
          setScanStatus(`Scanning... (${errorCount} attempts) - Ensure QR code is clear`);
        }
      };

        console.log('🚀 Starting QR scanner...');
        console.log('📷 Camera config:', cameraIdOrConfig);
        console.log('⚙️ Scanner config:', config);
        
        try {
          // 确保元素存在
          if (!document.getElementById(elementId)) {
            throw new Error('Scanner container element not found');
          }
          
          // 使用 start 方法，这是最直接的方式
          await html5QrCode.start(
            cameraIdOrConfig,
            config,
            qrCodeSuccessCallback,
            qrCodeErrorCallback
          );
          
          console.log('✅✅✅ QR scanner started successfully!');
          setScanStatus('✅ Scanner ready - point camera at QR code');
          
          // 10秒后如果还没扫描到，显示详细提示
          setTimeout(() => {
            if (isScanning && !scannedCode) {
              console.log('⏰ 10 seconds passed, still scanning...');
              setScanStatus('Still scanning... Tips: 1) Ensure QR code is clear 2) Good lighting 3) Hold steady');
            }
          }, 10000);
          
        } catch (startError: any) {
          console.error('❌ Failed to start scanner:', startError);
          console.error('Error details:', {
            name: startError.name,
            message: startError.message,
            stack: startError.stack
          });
          
          let errorMsg = startError.message || 'Failed to start scanner';
          if (startError.name === 'NotAllowedError') {
            errorMsg = t('search.cameraPermission');
          } else if (startError.name === 'NotFoundError') {
            errorMsg = 'Camera not found. Please check your device.';
          }
          
          setCameraError(errorMsg);
          setIsScanning(false);
          setShowCamera(true);
        }
    } catch (err: any) {
      console.error('QR scan error:', err);
      let errorMsg = t('search.cameraError');
      
      // 更详细的错误信息
      if (err.name === 'NotAllowedError' || 
          err.message?.toLowerCase().includes('permission') ||
          err.message?.toLowerCase().includes('not allowed')) {
        errorMsg = t('search.cameraPermission');
      } else if (err.name === 'NotFoundError' || 
                 err.message?.toLowerCase().includes('not found') ||
                 err.message?.toLowerCase().includes('no camera')) {
        errorMsg = t('search.cameraError');
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setCameraError(errorMsg);
      setIsScanning(false);
    }
  };

  // 请求相机权限
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      // 权限已授予，重试扫描
      await startQRScan();
    } catch (err: any) {
      console.error('Permission request error:', err);
      setCameraError(t('search.cameraPermission'));
      setIsScanning(false);
    }
  };

  // 停止扫描
  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error('Stop scan error:', err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
    setShowCamera(false);
    setCameraError(null);
    setScannedCode(null);
    setScanStatus('');
  };

  // 手动提交代码
  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;
    
    const wine = searchWineByCode(manualCode.trim());
    if (wine) {
      if (onWineSelect) {
        onWineSelect(wine);
      } else {
        router.push(`/wines/${wine.id}`);
      }
      setShowManualInput(false);
      setManualCode('');
    } else {
      // 显示未找到提示
      alert(t('search.codeNotFound'));
    }
  };

  // 拍照识别（使用二维码扫描功能，但可以扩展为图像识别）
  const handleTakePhoto = async () => {
    // 使用相同的扫描逻辑
    await startQRScan();
  };

  // 清理
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 搜索框 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{t('search.title')}</h2>
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('search.placeholder')}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {t('search.search')}
          </button>
        </div>

        {/* 扫描按钮 */}
        <div className="flex gap-3">
          <button
            onClick={startQRScan}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            {t('search.scanQR')}
          </button>
          <button
            onClick={() => setUseZXing(true)}
            className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm"
          >
            Scan (ZXing)
          </button>
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
          >
            {t('search.manualInput')}
          </button>
        </div>

        {/* 手动输入框 */}
        {showManualInput && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('search.enterCode')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                placeholder="WEIN-XXX-XXX or 4001234567890"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleManualSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                {t('search.submitCode')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 相机扫描区域 */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {isScanning ? t('search.scanning') : cameraError ? t('search.cameraError') : t('search.scanning')}
              </h3>
              <button
                onClick={stopScanning}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label={t('search.close')}
              >
                ×
              </button>
            </div>
            
            {!cameraError && (
              <div className="mb-4">
                {/* 全屏扫描区域，支持识别小二维码 */}
                <div id="qr-reader" className="w-full mb-2" style={{ minHeight: '400px', position: 'relative' }}></div>
                <p className="text-center text-sm text-gray-600 mb-2">
                  {t('search.scanningHint')} - 支持全屏扫描，小二维码也能识别
                </p>
                {scanStatus && (
                  <div className="text-center mb-2">
                    <p className={`text-sm font-medium ${
                      scanStatus.includes('✅') ? 'text-green-600' :
                      scanStatus.includes('⚠️') ? 'text-yellow-600' :
                      'text-blue-600'
                    } font-mono`}>
                      {scanStatus}
                    </p>
                    {scanStatus.includes('Not in database') && (
                      <button
                        onClick={() => {
                          if (scannedCode) {
                            setManualCode(scannedCode);
                            setShowManualInput(true);
                            stopScanning();
                          }
                        }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
                      >
                        {t('search.manualInput')} or {t('search.search')} by name
                      </button>
                    )}
                  </div>
                )}
                {/* 诊断信息 */}
                {isScanning && scanStatus.includes('attempts') && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                    <p className="text-xs text-yellow-800 mb-1">
                      <strong>扫描提示：</strong>
                    </p>
                    <ul className="text-xs text-yellow-700 list-disc list-inside space-y-1">
                      <li>确保二维码清晰可见，没有反光</li>
                      <li>保持手机稳定，不要晃动</li>
                      <li>确保光线充足</li>
                      <li>二维码应完全在白色扫描框内</li>
                      <li>如果还是不行，请尝试"Scan (ZXing)"按钮</li>
                    </ul>
                  </div>
                )}
                {scannedCode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
                    <p className="text-yellow-800 text-sm">
                      {locale === 'zh'
                        ? `已扫描到代码: ${scannedCode}，但未在数据库中找到。请尝试手动输入或使用文本搜索。`
                        : locale === 'de'
                        ? `Code gescannt: ${scannedCode}, aber nicht in der Datenbank gefunden. Bitte versuchen Sie die manuelle Eingabe oder Textsuche.`
                        : `Scanned code: ${scannedCode}, but not found in database. Please try manual input or text search.`}
                    </p>
                    <button
                      onClick={() => {
                        setManualCode(scannedCode);
                        setShowManualInput(true);
                        stopScanning();
                      }}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      {t('search.manualInput')}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {cameraError && (
              <div className="mb-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-medium mb-2">{cameraError}</p>
                  <p className="text-red-600 text-sm">
                    {locale === 'zh' 
                      ? '请检查浏览器设置，允许访问相机权限。在地址栏左侧点击锁图标可以管理权限。'
                      : locale === 'de'
                      ? 'Bitte überprüfen Sie Ihre Browser-Einstellungen und erlauben Sie den Kamera-Zugriff. Klicken Sie auf das Schloss-Symbol links in der Adressleiste, um Berechtigungen zu verwalten.'
                      : 'Please check your browser settings and allow camera access. Click the lock icon in the address bar to manage permissions.'}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    {locale === 'zh'
                      ? '💡 提示：如果无法使用相机，您也可以使用文本搜索功能来查找葡萄酒。'
                      : locale === 'de'
                      ? '💡 Tipp: Falls die Kamera nicht funktioniert, können Sie auch die Textsuche verwenden, um Weine zu finden.'
                      : '💡 Tip: If camera is not available, you can also use text search to find wines.'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={requestCameraPermission}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    {t('search.requestPermission')}
                  </button>
                  <button
                    onClick={startQRScan}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    {t('search.retry')}
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={stopScanning}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                {t('search.cancel')}
              </button>
              {!cameraError && isScanning && (
                <button
                  onClick={stopScanning}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  {t('search.close')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 搜索结果 */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
          </h3>
          <div className="space-y-4">
            {searchResults.map((wine) => (
              <div
                key={wine.id}
                onClick={() => {
                  if (onWineSelect) {
                    onWineSelect(wine);
                  } else {
                    router.push(`/wines/${wine.id}`);
                  }
                }}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <h4 className="font-semibold text-lg mb-2">
                  {locale === 'de' && wine.nameDe ? wine.nameDe :
                   locale === 'zh' && wine.nameZh ? wine.nameZh :
                   wine.name}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    {locale === 'de' && wine.countryDe ? wine.countryDe :
                     locale === 'zh' && wine.countryZh ? wine.countryZh :
                     wine.country} · {' '}
                    {locale === 'de' && wine.regionDe ? wine.regionDe :
                     locale === 'zh' && wine.regionZh ? wine.regionZh :
                     wine.region}
                  </p>
                  <p>
                    {locale === 'de' && wine.grapesDe ? wine.grapesDe.join(', ') :
                     locale === 'zh' && wine.grapesZh ? wine.grapesZh.join(', ') :
                     wine.grapes.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 无结果提示 */}
      {searchQuery && searchResults.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600">{t('search.noResults')}</p>
        </div>
      )}

      {/* ZXing 扫描器（备用方案） */}
      {useZXing && (
        <WineSearchZXing
          onWineSelect={onWineSelect}
          onClose={() => setUseZXing(false)}
        />
      )}
    </div>
  );
}

