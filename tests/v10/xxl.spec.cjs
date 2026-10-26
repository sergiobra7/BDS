const { test, expect } = require('@playwright/test');
test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
test('restored V10: legacy UI, text, camera and XXL facade',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/v10/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#tabs button').first()).toBeVisible({timeout:20000});
 await expect(page.locator('#content')).not.toBeEmpty();
 const textTab=page.locator('#tabs button').filter({hasText:/text|wand|plakat/i}).first();
 await expect(textTab).toBeVisible();await textTab.click();
 await expect(page.locator('#bds10-text-xxl-open')).toBeVisible({timeout:10000});
 await page.locator('#bds10-text-xxl-open').click();
 await expect(page.locator('#bds10-inline-xxl')).toBeVisible();
 await expect(page.locator('#bds10-inline-xxl')).toContainText('EXTREM BREIT');
 await page.locator('#bds10-text-xxl-open').click();
 await expect(page.locator('#bds10-inline-xxl')).toHaveCount(0);
 await expect(page.locator('#content')).not.toContainText(/SMART SCENE DIRECTOR PRO|EDITORIAL IMPACT PRO/i);
 expect(errors).toEqual([]);
});