import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db: FirebaseFirestore.Firestore | null = null;

try {
  // 檢查是否缺少環境變數
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error('❌【Firebase 錯誤】缺少 .env.local 環境變數！');
  } else {
    // 確保沒有重複初始化 (Next.js 熱更新防護)
    if (getApps().length === 0) {
      // 處理私鑰的換行與多餘引號
      privateKey = privateKey.replace(/\\n/g, '\n').replace(/"/g, '');
      
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('✅ Firebase Admin 初始化成功！');
    }
    
    // 取得資料庫實例
    db = getFirestore();
  }
} catch (error) {
  console.error('❌【Firebase 初始化崩潰】:', error);
}

export { db };