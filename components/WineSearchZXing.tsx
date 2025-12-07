'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrowserQRCodeReader } from '@zxing/browser';
import { useI18n } from '@/lib/i18n/context';
import { searchWineByCode } from '@/lib/wines/data';
import type { Wine } from '@/lib/wines/data';

interface WineSearchZXingProps {
  onWineSelect?: (wine: Wine) => void;
  onClose: () => void;
}

export function WineSearchZXing({ onWineSelect, onClose }: WineSearchZXingProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    const startScan = async () => {
      try {
        const codeReader = new BrowserQRCodeReader();
        codeReaderRef.current = codeReader;

        if (!videoRef.current) {
          setCameraError('Video element not found');
          return;
        }

        setScanStatus('Starting camera...');

        // 使用简单的视频约束
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: 'environment'
          }
        };

        // 获取媒体流
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setScanStatus('Scanner ready - point at QR code');

        // 使用简化的 ZXing API - 不指定设备ID，让它自动选择
        codeReader.decodeFromVideoDevice(
          undefined, // 让 ZXing 自动选择设备
          videoRef.current,
          (result, error) => {
            if (result) {
              const decodedText = result.getText();
              console.log('✅✅✅ ZXing Scanned code:', decodedText);
              setScanStatus(`✅ Scanned: ${decodedText}`);

              const wine = searchWineByCode(decodedText);
              if (wine) {
                console.log('✅✅✅ Wine found:', wine.name);
                setScanStatus(`✅ Found: ${wine.name}`);
                stopScan();
                if (onWineSelect) {
                  onWineSelect(wine);
                } else {
                  router.push(`/wines/${wine.id}`);
                }
              } else {
                console.log('⚠️ Code not in database:', decodedText);
                setScanStatus(`⚠️ Scanned: ${decodedText} (Not in database)`);
              }
            }
            if (error) {
              // 忽略正常的扫描错误
              if (!error.message?.includes('No QR code') && 
                  !error.message?.includes('NotFoundException')) {
                // 只记录严重错误
                console.log('Scan error:', error.message);
              }
            }
          }
        );
      } catch (err: any) {
        console.error('ZXing scan error:', err);
        let errorMsg = err.message || 'Failed to start scanner';
        if (err.name === 'NotAllowedError') {
          errorMsg = t('search.cameraPermission');
        } else if (err.name === 'NotFoundError') {
          errorMsg = 'Camera not found';
        }
        setCameraError(errorMsg);
        setScanStatus('');
      }
    };

    startScan();

    return () => {
      stopScan();
    };
  }, [t]);

  const stopScan = () => {
    // 停止视频流
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // 停止扫描器
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      codeReaderRef.current = null;
    }
    
    // 清除视频元素
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {scanStatus || t('search.scanning')}
          </h3>
          <button
            onClick={() => {
              stopScan();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {cameraError ? (
          <div className="mb-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">{cameraError}</p>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              style={{ maxHeight: '500px', width: '100%' }}
              playsInline
              autoPlay
              muted
            />
            <p className="text-center text-sm text-gray-600 mt-2">
              {t('search.scanningHint')} - 全屏扫描模式，支持识别小二维码
            </p>
            {scanStatus && (
              <p className="text-center text-xs text-blue-600 mt-2 font-mono">
                {scanStatus}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => {
            stopScan();
            onClose();
          }}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
        >
          {t('search.cancel')}
        </button>
      </div>
    </div>
  );
}

