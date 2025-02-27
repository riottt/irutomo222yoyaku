import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, XCircle, DoorClosed, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CautionsProps {
  language: 'ko' | 'ja' | 'en';
  onLanguageChange: (lang: 'ko' | 'ja' | 'en') => void;
  onBack: () => void;
}

export default function Cautions({ language, onLanguageChange, onBack }: CautionsProps) {
  const navigate = useNavigate();

  const cautionItems = [
    {
      icon: XCircle,
      title: {
        ko: '예약 취소 불가',
        ja: '予約キャンセル不可',
        en: 'No Cancellation',
      },
      description: {
        ko: '예약이 확정된 후에는 취소가 불가능합니다. 신중하게 예약해주세요. 레스토랑 측에 확정된 예약은 저희도 취소할 수 없습니다.',
        ja: '予約確定後のキャンセルはできません。慎重に予約してください。レストラン側に確定された予約は当社もキャンセルできません。',
        en: 'Cancellation is not possible after the reservation is confirmed. Please reserve carefully. We cannot cancel reservations that have been confirmed with the restaurant.',
      },
    },
    {
      icon: AlertCircle,
      title: {
        ko: '수수료 환불 불가',
        ja: '手数料返金不可',
        en: 'No Refund of Fees',
      },
      description: {
        ko: '예약 수수료는 어떠한 경우에도 환불되지 않습니다. 이는 레스토랑 예약 서비스 제공에 대한 비용으로, 예약 확정 여부와 관계없이 발생합니다.',
        ja: '予約手数料はいかなる場合も返金されません。これはレストラン予約サービス提供のための費用であり、予約確定の有無にかかわらず発生します。',
        en: 'The reservation fee is non-refundable under any circumstances. This is a fee for providing the restaurant reservation service and is incurred regardless of whether the reservation is confirmed.',
      },
    },
    {
      icon: Clock,
      title: {
        ko: '예약 시간 엄수',
        ja: '予約時間厳守',
        en: 'Punctuality Required',
      },
      description: {
        ko: '예약 시간 10분 전까지 도착하지 않을 경우 예약이 취소될 수 있습니다. 일본 식당은 시간 엄수에 매우 엄격하므로 반드시 준수해주세요.',
        ja: '予約時間の10分前までに到着されない場合、予約がキャンセルされる可能性があります。日本のレストランは時間厳守に非常に厳格ですので、必ず守ってください。',
        en: 'If you do not arrive 10 minutes before your reservation time, your reservation may be canceled. Japanese restaurants are very strict about punctuality, so please be sure to comply.',
      },
    },
    {
      icon: AlertCircle,
      title: {
        ko: '인원 수 변경',
        ja: '人数変更',
        en: 'Change in Party Size',
      },
      description: {
        ko: '예약 인원 수의 변경은 불가능합니다. 인원 수가 변경되는 경우 새로 예약해주셔야 합니다. 이는 레스토랑 측의 좌석 준비와 관련된 정책입니다.',
        ja: '予約人数の変更はできません。人数が変更される場合は、新規予約が必要です。これはレストラン側の座席準備に関連したポリシーです。',
        en: 'Changes to the number of people in the reservation are not possible. If the number of people changes, you need to make a new reservation. This is a policy related to the restaurant\'s seating preparations.',
      },
    },
    {
      icon: DoorClosed,
      title: {
        ko: '노쇼 패널티',
        ja: 'ノーショーペナルティ',
        en: 'No-Show Penalty',
      },
      description: {
        ko: '노쇼 시 향후 서비스 이용이 제한될 수 있습니다. 노쇼는 레스토랑에게 피해를 주고 다른 고객의 예약 기회를 빼앗는 행위입니다.',
        ja: 'ノーショーの場合、今後のサービス利用が制限される可能性があります。ノーショーはレストランに損害を与え、他のお客様の予約機会を奪う行為です。',
        en: 'If you do not show up, your future use of the service may be restricted. No-shows harm restaurants and deprive other customers of reservation opportunities.',
      },
    },
  ];

  const additionalCautions = [
    {
      title: {
        ko: '메뉴 및 가격 변동',
        ja: 'メニューと価格の変動',
        en: 'Menu and Price Changes',
      },
      description: {
        ko: '레스토랑의 메뉴와 가격은 예고 없이 변경될 수 있습니다. 웹사이트에 표시된 정보는 참고용이며, 실제와 다를 수 있습니다.',
        ja: 'レストランのメニューと価格は予告なく変更される場合があります。ウェブサイトに表示されている情報は参考用であり、実際と異なる場合があります。',
        en: 'Restaurant menus and prices are subject to change without notice. Information displayed on the website is for reference only and may differ from the actual.',
      },
    },
    {
      title: {
        ko: '특별 요청 불가 항목',
        ja: '特別リクエスト不可項目',
        en: 'Unavailable Special Requests',
      },
      description: {
        ko: '일부 레스토랑에서는 특정 좌석 지정, 룸 변경, 메뉴 변경 등의 특별 요청이 불가능할 수 있습니다. 이는 각 레스토랑의 정책에 따릅니다.',
        ja: '一部のレストランでは、特定の座席指定、部屋の変更、メニューの変更などの特別リクエストができない場合があります。これは各レストランのポリシーによります。',
        en: 'Some restaurants may not be able to accommodate special requests such as specific seat assignments, room changes, menu modifications, etc. This depends on each restaurant\'s policy.',
      },
    },
    {
      title: {
        ko: '예약 확정 시간',
        ja: '予約確定時間',
        en: 'Reservation Confirmation Time',
      },
      description: {
        ko: '예약 확정에는 일반적으로 2시간 이내가 소요되나, 레스토랑의 사정에 따라 지연될 수 있습니다. 급한 예약의 경우 프리미엄 옵션을 이용해주세요.',
        ja: '予約確定には一般的に2時間以内がかかりますが、レストランの事情により遅延する場合があります。急ぎの予約の場合はプレミアムオプションをご利用ください。',
        en: 'Reservation confirmation typically takes within 2 hours, but may be delayed depending on the restaurant\'s circumstances. Please use the premium option for urgent reservations.',
      },
    },
  ];

  const legalNotices = {
    ko: '본 서비스는 레스토랑 예약 중개 서비스로, 식사 경험 자체에 대한 책임은 지지 않습니다. 레스토랑 내 서비스, 음식 품질, 대기 시간 등은 각 레스토랑의 책임하에 있으며, IRUTOMO는 이에 대한 보증을 제공하지 않습니다. 또한 레스토랑 정보의 정확성을 위해 최선을 다하고 있으나, 실제 방문 시 차이가 있을 수 있음을 알려드립니다.',
    ja: '本サービスはレストラン予約仲介サービスであり、食事体験自体に対する責任は負いかねます。レストラン内のサービス、料理の品質、待ち時間などは各レストランの責任の下にあり、IRUTOMOはこれに対する保証を提供しません。また、レストラン情報の正確性のために最善を尽くしていますが、実際の訪問時に差がある可能性があることをお知らせします。',
    en: 'This service is a restaurant reservation intermediary service and does not take responsibility for the dining experience itself. Restaurant service, food quality, waiting time, etc. are under the responsibility of each restaurant, and IRUTOMO does not provide any guarantee for these. While we do our best to ensure the accuracy of restaurant information, please note that there may be differences when you actually visit.',
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-[#FF8C00]">IRUTOMO</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {language === 'ko' ? '예약 주의사항' : language === 'ja' ? '予約注意事項' : 'Reservation Cautions'}
          </h1>
          
          <div className="bg-red-50 border border-red-100 rounded-lg p-6 mb-12">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mr-3 mt-1" />
              <p className="text-red-700 font-medium">
                {language === 'ko' 
                  ? '예약 전 반드시 아래 주의사항을 확인해주세요. 예약 진행 시 아래 내용에 동의한 것으로 간주됩니다.' 
                  : language === 'ja' 
                  ? '予約前に必ず以下の注意事項をご確認ください。予約手続きの際には、以下の内容に同意したものとみなされます。' 
                  : 'Please check the following cautions before making a reservation. By proceeding with the reservation, you are deemed to have agreed to the following.'}
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-[#FF8C00]">
              {language === 'ko' ? '주요 주의사항' : language === 'ja' ? '主な注意事項' : 'Key Cautions'}
            </h2>
            <div className="space-y-8">
              {cautionItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                >
                  <div className="flex items-start">
                    <div className="bg-red-50 p-3 rounded-full mr-4 flex-shrink-0">
                      <item.icon className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{item.title[language]}</h3>
                      <p className="text-gray-700">{item.description[language]}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-[#FF8C00]">
              {language === 'ko' ? '추가 주의사항' : language === 'ja' ? '追加注意事項' : 'Additional Cautions'}
            </h2>
            <div className="space-y-6">
              {additionalCautions.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                >
                  <h3 className="font-semibold text-lg mb-2">{item.title[language]}</h3>
                  <p className="text-gray-700">{item.description[language]}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-12 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {language === 'ko' ? '법적 고지' : language === 'ja' ? '法的通知' : 'Legal Notice'}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {legalNotices[language]}
            </p>
          </div>

          <div className="text-center">
            <a
              href="#"
              onClick={onBack}
              className="inline-block bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              {language === 'ko' ? '이해했습니다' : language === 'ja' ? '理解しました' : 'I Understand'}
            </a>
          </div>
        </motion.div>
      </main>

      <footer className="bg-gray-50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 IRUTOMO All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
} 