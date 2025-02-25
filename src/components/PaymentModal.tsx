import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { PayPalButtons } from '@paypal/react-paypal-js';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  amount: number;
  language: 'ko' | 'ja';
}

export default function PaymentModal({ isOpen, onClose, onComplete, amount, language }: PaymentModalProps) {
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const amountUSD = Math.ceil(amount / 150); // Approximate JPY to USD conversion

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">
            {language === 'ko' ? '결제하기' : '決済する'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <p className="text-center text-2xl font-semibold text-[#FF8C00]">
              {amount.toLocaleString()}
              <span className="ml-1">
                {language === 'ko' ? '엔' : '円'}
              </span>
            </p>
            <p className="text-center text-gray-600 mt-1">
              {language === 'ko' 
                ? '예약 수수료' 
                : '予約手数料'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(_data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: amountUSD.toString(),
                      currency_code: "USD"
                    }
                  }
                ]
              });
            }}
            onApprove={async (data, actions) => {
              try {
                const order = await actions.order?.capture();
                console.log('Payment completed:', order);
                onComplete();
              } catch (error) {
                console.error('Payment error:', error);
                setError(language === 'ko'
                  ? '결제 처리 중 오류가 발생했습니다'
                  : '決済処理中にエラーが発生しました');
              }
            }}
            onError={(err) => {
              console.error('PayPal error:', err);
              setError(language === 'ko'
                ? '결제 처리 중 오류가 발생했습니다'
                : '決済処理中にエラーが発生しました');
            }}
          />

          <p className="text-center text-sm text-gray-500 mt-4">
            {language === 'ko'
              ? '* 이 화면은 시뮬레이션입니다'
              : '* この画面はシミュレーションです'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}