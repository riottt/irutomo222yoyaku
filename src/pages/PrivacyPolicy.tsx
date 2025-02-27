import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PrivacyPolicyProps {
  language: 'ko' | 'ja' | 'en';
}

export default function PrivacyPolicy({ language }: PrivacyPolicyProps) {
  const navigate = useNavigate();
  
  const translations = {
    ko: {
      title: '개인정보 처리방침',
      back: '뒤로',
      content: `
# 개인정보 처리방침

저희 IRUTOMO는 고객님의 개인정보 프라이버시를 보호하고 적용되는 법률 하에서의 데이터 보호 원칙 및 규정을 준수할 것을 약속합니다.

저희는 귀하가 웹사이트 https://irutomops.studio.site 및/또는 IRUTOMO 앱(이하 "IRUTOMO 플랫폼")을 사용하고, IRUTOMO 또는 제3자 운영자(이하 "운영자")가 제공하는 서비스(이하 "서비스")를 이용할 때 귀하의 정보를 수집, 처리, 사용 및 공개할 수 있습니다. 본 개인정보 처리방침에서 "귀하"란 IRUTOMO 플랫폼에 접속하거나 서비스를 이용하는 모든 사람을 의미합니다.

이 개인정보 처리방침은 IRUTOMO가 IRUTOMO 플랫폼에 접속하거나 서비스를 이용할 때 귀하로부터 얻는 정보를 수집, 처리, 사용 및 공개하는 기본적인 조건 및 조항을 정의합니다. 그 정보에는 이름, 주소, 전화번호, 이메일 주소, 여행 서류 정보, 차량 렌탈 정보, 보험 정보, 연령, 생년월일 등 특정 개인과 관련된 개인정보가 포함될 수 있습니다(이하 "개인정보").

이 개인정보 처리방침을 주의 깊게 읽어주십시오. IRUTOMO 플랫폼을 방문함으로써 귀하는 이 개인정보 처리방침에 명시된 개인정보의 수집, 처리, 사용 및 공개에 동의하게 됩니다.

## 조건의 범위
IRUTOMO는 예고 없이 이 개인정보 처리방침의 조항 또는 그 일부를 업데이트, 수정, 변경할 권리를 보유합니다. 귀하가 IRUTOMO 플랫폼에 대한 접근을 계속하거나 서비스를 이용함으로써 업데이트, 수정, 변경된 개인정보 처리방침에 동의한 것으로 간주됩니다. 단, 변경이 권리를 감소시키는 경우에는 동의를 요청할 수 있습니다.

이 개인정보 처리방침의 모든 조건 및/또는 그 후의 업데이트, 수정, 변경에 동의하지 않는 경우에는 즉시 IRUTOMO 플랫폼에 대한 접근 및 서비스 이용을 중단하십시오.

## 정보의 수집
저희는 IRUTOMO 플랫폼을 사용할 때 제공되는 개인정보나 사용자 계정(이하 "사용자 계정")을 개설할 때, IRUTOMO 플랫폼을 방문할 때, 예약이나 렌탈, 구매 등을 할 때 제공되는 정보를 수집할 수 있습니다. 개인정보의 제공은 항상 자발적입니다. 그러나 개인정보를 제공하지 않을 경우, 일부 서비스를 제공하지 못할 수 있습니다. 예를 들어, 사용자 계정의 개설이나 예약, 렌탈의 절차를 할 수 없게 됩니다.

1. 사용자 계정 개설 시(현재 기능 없음): 이름, 이메일 주소, 사용자 이름, 비밀번호, 전화번호 등의 개인정보를 수집합니다.
2. IRUTOMO 플랫폼 방문, 예약, 렌탈, 구매 등의 이용 시: 대응하기 위한 정보(여행 서류 정보, 차량 렌탈 정보, 보험 정보, 연령, 생년월일, ID 번호, 배송지 주소 등)를 수집하고 저장합니다.

## 정보의 저장
수집한 개인정보 및 기타 데이터는 서버 또는 제3자 서비스 제공업체의 서버로 전송, 처리 및 저장될 수 있습니다. 개인정보는 필요한 기간 동안만 저장되며, 법적 요구 사항에 따라 처리됩니다. 불필요해진 경우에는 데이터를 삭제하거나 익명화합니다.

## 정보의 이용
저희는 귀하의 개인정보를 계약 이행 및 서비스 제공을 위해 처리합니다. 또한, 서비스 개선이나 다이렉트 마케팅 목적으로 개인정보를 처리할 수 있습니다.

## 정보의 공개
다음 상황에서 개인정보를 제3자와 공유 및 공개할 수 있습니다.
1. 예약이나 렌탈 절차를 완료하기 위해 운영자 또는 제3자(여행사, 레스토랑, 교통수단 등)와 공유합니다.
2. 법적 요구 사항에 따라 공개가 필요한 경우.
3. IRUTOMO 그룹 내에서 공유하는 경우.
4. 고문, 에이전시, 기타 관계자와 공유하는 경우.

## 보험
보험 서비스에 가입할 때는 별도의 계약에 동의해야 합니다.

## 쿠키
쿠키는 웹사이트의 기능을 향상시키기 위해 널리 사용됩니다. IRUTOMO 플랫폼에 접속할 때 쿠키를 통해 개인정보가 수집될 수 있습니다.

## 고객님의 권리
고객님은 IRUTOMO 플랫폼의 "내 계정"에서 개인정보에 대한 접근, 수정, 삭제를 언제든지 할 수 있습니다. 또한 이메일로 요청을 보낼 수도 있습니다: gespokrofficial@gmail.com

## 문의
이 개인정보 처리방침에 관한 질문은 이메일로 문의해 주십시오: gespokrofficial@gmail.com

이 정책은 지정된 상거래에 관한 법률 가이드라인을 준수합니다.
      `,
    },
    ja: {
      title: 'プライバシーポリシー',
      back: '戻る',
      content: `
# プライバシーポリシー

私たちIRUTOMOは、お客様の個人情報のプライバシーを保護し、適用される法令の下でのデータ保護原則および規定を遵守することを約束します。

私たちは、お客様が本ウェブサイト https://irutomops.studio.siteおよび/またはIRUTOMOアプリ（以下、総称して「IRUTOMOプラットフォーム」）を使用し、IRUTOMOまたは第三者の運営者（以下、「運営者」）が提供するサービス（以下、「サービス」）を利用する際に、お客様の情報を収集、処理、使用および開示することがあります。本プライバシーポリシーにおいて「お客様」とは、IRUTOMOプラットフォームにアクセスする、またはサービスを利用するすべての人を指します。

このプライバシーポリシーは、IRUTOMOがIRUTOMOプラットフォームにアクセスし、またはサービスを利用する際にお客様から取得する情報を収集、処理、使用および開示する基本的な条件および条項を定めています。その情報には、名前、住所、電話番号、電子メールアドレス、旅行書類情報、車両レンタル情報、保険情報、年齢、生年月日など、特定の個人に関連する個人情報が含まれることがあります（以下、「個人情報」）。

このプライバシーポリシーを注意深くお読みください。IRUTOMOプラットフォームを訪問することで、お客様はこのプライバシーポリシーに定められた個人情報の収集、処理、使用および開示に同意することになります。

## 条件の範囲
IRUTOMOは、予告なしにこのプライバシーポリシーの条項またはその一部を更新、修正、変更する権利を留保します。お客様がIRUTOMOプラットフォームへのアクセスを継続し、またはサービスを利用することにより、更新、修正、変更されたプライバシーポリシーに同意したものとみなされます。ただし、変更が権利を減少させる場合は、同意を求める場合があります。

このプライバシーポリシーのすべての条件および/またはその後の更新、修正、変更に同意しない場合は、直ちにIRUTOMOプラットフォームへのアクセスおよびサービスの利用を停止してください。

## 情報の収集
私たちは、IRUTOMOプラットフォームを使用する際に提供される個人情報や、ユーザーアカウント（以下、「ユーザーアカウント」）を開設する際、IRUTOMOプラットフォームを訪問する際、予約やレンタル、購入などを行う際に提供される情報を収集することがあります。個人情報の提供は常に任意です。しかし、個人情報を提供しない場合、一部のサービスを提供できないことがあります。例えば、ユーザーアカウントの開設や予約、レンタルの手続きができなくなります。

1. ユーザーアカウントの開設時（現在機能なし）：名前、メールアドレス、ユーザー名、パスワード、電話番号などの個人情報を収集します。
2. IRUTOMOプラットフォームの訪問、予約、レンタル、購入などの利用時：対応するための情報（旅行書類情報、車両レンタル情報、保険情報、年齢、生年月日、ID番号、配送先住所など）を収集し、保存します。

## 情報の保存
収集した個人情報およびその他のデータは、サーバーまたは第三者のサービスプロバイダーのサーバーに転送、処理、および保存されることがあります。個人情報は、必要な期間だけ保存され、法的要件に従って処理されます。不要になった場合は、データを削除または匿名化します。

## 情報の利用
私たちは、お客様の個人情報を契約履行およびサービス提供のために処理します。さらに、サービス改善やダイレクトマーケティングの目的で個人情報を処理することがあります。

## 情報の開示
以下の状況において、個人情報を第三者と共有および開示することがあります。
1. 予約やレンタルの手続きを完了するために、運営者または第三者（旅行会社、レストラン、交通機関など）と共有します。
2. 法的要件に基づいて開示が必要な場合。
3. IRUTOMOグループ内で共有する場合。
4. 顧問、エージェンシー、その他の関係者と共有する場合。

## 保険
保険サービスにサインアップする際、別途契約に同意する必要があります。

## クッキー
クッキーは、ウェブサイトの機能を向上させるために広く使用されています。IRUTOMOプラットフォームにアクセスする際に、クッキーを通じて個人情報が収集されることがあります。

## お客様の権利
お客様は、IRUTOMOプラットフォームの「マイアカウント」から、個人情報へのアクセス、修正、削除をいつでも行うことができます。また、メールでリクエストを送信することもできます。gespokrofficial@gmail.com 

## お問い合わせ
このプライバシーポリシーに関するご質問は、メールでお問い合わせください。 gespokrofficial@gmail.com 

このポリシーは、指定された商取引に関する法律のガイドラインに準拠しています。
      `,
    },
    en: {
      title: 'Privacy Policy',
      back: 'Back',
      content: `
# Privacy Policy

We at IRUTOMO are committed to protecting the privacy of your personal information and complying with data protection principles and regulations under applicable laws.

We may collect, process, use and disclose your information when you use our website https://irutomops.studio.site and/or the IRUTOMO app (collectively, the "IRUTOMO Platform") and use services provided by IRUTOMO or third-party operators (the "Operators"). In this Privacy Policy, "you" refers to anyone who accesses the IRUTOMO Platform or uses the Services.

This Privacy Policy sets out the basic terms and conditions under which IRUTOMO collects, processes, uses, and discloses information obtained from you when accessing the IRUTOMO Platform or using the Services. This information may include personal information related to a specific individual, such as name, address, phone number, email address, travel document information, vehicle rental information, insurance information, age, date of birth, etc. (hereinafter "Personal Information").

Please read this Privacy Policy carefully. By visiting the IRUTOMO Platform, you agree to the collection, processing, use and disclosure of personal information as set out in this Privacy Policy.

## Scope of Terms
IRUTOMO reserves the right to update, modify or change the terms of this Privacy Policy or any part thereof without notice. By continuing to access the IRUTOMO Platform or use the Services, you will be deemed to have agreed to the updated, modified or changed Privacy Policy. However, if the changes reduce your rights, we may ask for your consent.

If you do not agree to all the terms of this Privacy Policy and/or subsequent updates, modifications or changes, please immediately discontinue your access to the IRUTOMO Platform and use of the Services.

## Information Collection
We may collect personal information provided when using the IRUTOMO Platform, information provided when opening a user account (hereinafter "User Account"), when visiting the IRUTOMO Platform, and when making reservations, rentals, purchases, etc. The provision of personal information is always voluntary. However, if you do not provide personal information, we may not be able to provide some services. For example, you will not be able to open a User Account or make reservations or rentals.

1. When opening a User Account (currently not functional): We collect personal information such as name, email address, username, password, phone number, etc.
2. When using the IRUTOMO Platform, making reservations, rentals, purchases, etc.: We collect and store information for correspondence (travel document information, vehicle rental information, insurance information, age, date of birth, ID number, delivery address, etc.).

## Information Storage
The personal information and other data collected may be transferred, processed, and stored on our servers or on the servers of third-party service providers. Personal information is stored only for the necessary period and processed in accordance with legal requirements. When no longer needed, we delete or anonymize the data.

## Information Use
We process your personal information for contract performance and service provision. In addition, we may process personal information for the purpose of improving services or direct marketing.

## Information Disclosure
We may share and disclose personal information to third parties in the following situations:
1. Sharing with operators or third parties (travel agencies, restaurants, transportation, etc.) to complete reservation or rental procedures.
2. When disclosure is necessary based on legal requirements.
3. When shared within the IRUTOMO group.
4. When shared with advisors, agencies, and other relevant parties.

## Insurance
When signing up for insurance services, you will need to agree to a separate contract.

## Cookies
Cookies are widely used to enhance website functionality. Personal information may be collected through cookies when accessing the IRUTOMO Platform.

## Your Rights
You can access, modify, and delete your personal information at any time from "My Account" on the IRUTOMO Platform. You can also send requests by email: gespokrofficial@gmail.com

## Contact
For questions about this Privacy Policy, please contact us by email: gespokrofficial@gmail.com

This policy complies with the guidelines of the specified laws on commercial transactions.
      `,
    }
  };

  const t = translations[language] || translations.ja;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-[#FF8C00] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-[#FF8C00] ml-4">{t.title}</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="privacy-policy-content prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: `
                  <style>
                    h1, h2 { color: #FF8C00; margin-top: 2rem; margin-bottom: 1rem; }
                    h1 { font-size: 1.8rem; }
                    h2 { font-size: 1.5rem; }
                    p { margin-bottom: 1rem; line-height: 1.6; }
                    ul { margin-left: 1.5rem; margin-bottom: 1rem; }
                    li { margin-bottom: 0.5rem; }
                  </style>
                  ${t.content
                    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
                    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\n([0-9]+\.) /g, '</p><ul><li>')
                    .replace(/\n([0-9]+\.) /g, '</li><li>')
                    .replace(/<\/li><li>([^<]*?)$/g, '</li></ul><p>')
                    .replace(/^<\/p>/, '')
                    .replace(/$/, '</p>')}
                `
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 