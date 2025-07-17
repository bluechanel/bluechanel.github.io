---
title: 🤖 QQ Bot+notion实现随手记
description: 小玩具
date: 2022-08-16
updateDate: 2025-04-11
tags: ["Notion"]
cover:
    image: images/224be3c3-178a-49f0-af8e-1528acf9aa94_5f7f0b6047be0b8e9579ef48a693e2f5.png
ShowToc: true
---

习惯在QQ置顶一个小号，用于“随手记”。可能是某一时刻的想法，或者是链接等，每天早晨都会看之前的随手记，有些可以看到就做。还有一些是flag，当前可能做不了，需要稍后的，QQ查看之前的聊天的记录，已完成未完成混杂在一起，查看起来有些麻烦。随着notion开放API，便想到了使用QQ或wechat输入（这个两个app每天打开无数次），notion收集。经过研究，wechat接入第三方应用非常的麻烦，可行性太低。QQ则可以借助各种qq bot工具实现第三方的接入。因此我便使用[cqhttp](https://github.com/nonebot/aiocqhttp)+python脚本实现自己的收集工具，具体过程如下(在腾讯云服务器实现)


# [cqhttp](https://github.com/Mrs4s/go-cqhttp)

1. 在[github](https://github.com/Mrs4s/go-cqhttp/releases)下载合适的安装包到本地机器，并解压 支持win，linux，macos
2. 首次执行`./go-cqhttp`，生成配置文件config.yml

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/74d2b771-a6b7-4c6b-bfb8-41fbb62aa2e4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FXNLLES%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T081047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJHMEUCIQD9N4T24juiyzw9KUyZw%2BVT%2F4pDykvYRGv9tkyZ75MrHgIgO2tZQJDCEU5%2FstSev0BxP5C%2FOqbpzJ3tB50Yfxf%2Bf8sq%2FwMIcBAAGgw2Mzc0MjMxODM4MDUiDNDFINjNMvmjLnUW5SrcAzWP%2BTUarzJTpcLYGrxNALG2%2BSIbbcY5PBVaUW1hi%2F5CeNF9QDph2D9cV5QvfFYnsLaASxiCYMSVROucO6r8l0EmUEuU7zQ4BQ0FXX1DwMzUzNzpIgZTcR07mUeTF5SDc%2BXH7HJCzJIVJlGHzVetfYQNF84HuO2qJ0Mwoy%2B5CdEHipR8EvTG739ui5MPRj2T3LCVN5bgRCP%2BVko7ecIuWl2cnCDz3OBDwB0KZDgH%2FPRbu%2BK8Lrk%2FvBOzCw2xqeykFL%2Fq8x%2BOD%2BL2M9R9PQfS%2BQ8LTXK5%2FbAUXn0%2BWxho2HOzEcTU8pHDde58G1x5oxUukVbEXEpYTzmfqzqjK0iipiH7ZymMwNeatwtxMyX6qEzzxoXN0BGG3pltIMKrRaxh8Z4MJmr28t%2FkdqZMnIjQ33WwA2ljegA38prvvOdgnrNsX5RL7uqslK7lu1vstEEpdU2Pd3UL%2FcHi7Jykb%2FsG0%2BnAOfe5UEKvYlEyH%2Bf%2BkKy%2B%2BlJ3FbvUcTtYAzZ8iJ%2BDgVXnqn%2FF7w7uOsgIDJOGpe03DaDN1KTpDPsRc1nWG36C2ldT4q3uuI2SsRFpLdXIWINOHg4GnXY7sFTCqJ3XY3OmQZOVpkjy1AhIi3PhFnKTfsRnoCYpS68cuOkwMIjB4sMGOqUB7YNGb654IQ1Rn1UH%2Bu4Llc631661xJOvUnnPiZU4GT1l6eli9qKSpYsQZtmQ6F6fLMPvN%2FtocaGM9gDDhvdVA2AdcYiH9QWwggkNvYRDFiPzQ6Qpp4fGmBmEMAOEACLjUuvuhdYcaRTf%2FK5xo96aiy%2Bx7zwIN9kSV19x%2FzTIYcepzlfFpzQUfPQ8en8MrPm%2FY0G5rDlBV%2BESjps1CHVGyQGKxS0H&X-Amz-Signature=bc5f865c3898df10247fcd42ad5f695a8a8af730dd0af8520031ce19b723fbc0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

3. 修改config.yml ,配置账户和密码。记住下面的servers的链接端口。更新详细的[配置参考官方](https://docs.go-cqhttp.org/guide/config.html#%E9%85%8D%E7%BD%AE%E4%BF%A1%E6%81%AF)

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/79142ab5-969e-48e6-934c-75120cc752cd/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46672IOWLBC%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T081047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJIMEYCIQCajf7hif5QkYkS0Pm56PPu0DUxPihadPxWYPflP7EAAgIhAN1MlUkkmxgF6jC2UCMl6wmkrziLIhzwQUDo1X0do7BNKv8DCHAQABoMNjM3NDIzMTgzODA1IgxjikdQVOCNRXTXMLEq3AMWS%2F9Nt8JqNEPh3%2FDev5MbFWEAzedgr1WQd1vxSjXz12PRag98D1wWidWnhAkgo1E%2B9tw4KGZgsDAhGOVuivxZ9hQgptBjoRP10%2FZd%2B85NKsvqb%2FmEJwo%2FZVAcSZnUBlux3eb4FQYwNxCb60vCyxdjkXpyoM1H4oq6D8p7wNALNCl%2FA11Q2gxaVU1n%2FcsDB7WEXEU%2BIKluzhUmHHuuGUkdQkYqTphIvpVHet8CVAvBuFXHzO3I9TMmWE3IABuBzVYAlPl%2FzzUyJTAB%2FzPzaOQGhx%2FOgz470eEzOkcyztNBbS48F1TCe6SJDE3aVkcdzmv0V9iuDJPQUxxCQDknqWGHgE1WpVGV3fGSNCeUuJ8cnaaxK3dsoX868%2B1SGjDMotJKZGwK3ELDakKXltBukVQWOreo9a%2Fz74uunNrOx6VI0CWDcoq7Chr2g2OzT3ZMoriFnGXFa0mdx3Vq24LXeRzNpBYlRUb7LK%2F%2F%2Fsd9jVwhJCLZJ2%2B8m%2F%2BLpIvMKsZic2cxhmMV4QkoGH53mZPFou7EpOqzlKfpBwGFaL9CHTYN%2F76x%2Bb%2BxhS%2FWyJWppoq9pvXS5Y6%2BPRZc3YGSXjW%2Ftz8L4Py7vY9F7avik4mriOWkPRzfmiK88VU6sloihDDgvuLDBjqkAZJHY5xNnPt4WepsI4qNc3X%2FwPZtbuJZpsLKOo30Gd2R4H1zS62A6T3XIQrZa7p3KkbYhIkKpfDyjwBBN1iesa%2F2cUhG5ZS6bG5I%2BAgD7VFcud3E5yeU5q%2FF85bz7VSYoh5lMGey43eKsE5pspQA%2BsNahexpFVxFrl2Czk8u1lgpLp17jTfZ0OTZ5CxBUX8ld5BkAEL59qazq3BeR7B1KayTegf8&X-Amz-Signature=64d91e14e3799a3a980934971cbb6cfb0271407f9f88942ab46b8e55fa62b58f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/2dff1ba7-3e89-40cd-a7ae-15fc422a578d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46672IOWLBC%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T081047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJIMEYCIQCajf7hif5QkYkS0Pm56PPu0DUxPihadPxWYPflP7EAAgIhAN1MlUkkmxgF6jC2UCMl6wmkrziLIhzwQUDo1X0do7BNKv8DCHAQABoMNjM3NDIzMTgzODA1IgxjikdQVOCNRXTXMLEq3AMWS%2F9Nt8JqNEPh3%2FDev5MbFWEAzedgr1WQd1vxSjXz12PRag98D1wWidWnhAkgo1E%2B9tw4KGZgsDAhGOVuivxZ9hQgptBjoRP10%2FZd%2B85NKsvqb%2FmEJwo%2FZVAcSZnUBlux3eb4FQYwNxCb60vCyxdjkXpyoM1H4oq6D8p7wNALNCl%2FA11Q2gxaVU1n%2FcsDB7WEXEU%2BIKluzhUmHHuuGUkdQkYqTphIvpVHet8CVAvBuFXHzO3I9TMmWE3IABuBzVYAlPl%2FzzUyJTAB%2FzPzaOQGhx%2FOgz470eEzOkcyztNBbS48F1TCe6SJDE3aVkcdzmv0V9iuDJPQUxxCQDknqWGHgE1WpVGV3fGSNCeUuJ8cnaaxK3dsoX868%2B1SGjDMotJKZGwK3ELDakKXltBukVQWOreo9a%2Fz74uunNrOx6VI0CWDcoq7Chr2g2OzT3ZMoriFnGXFa0mdx3Vq24LXeRzNpBYlRUb7LK%2F%2F%2Fsd9jVwhJCLZJ2%2B8m%2F%2BLpIvMKsZic2cxhmMV4QkoGH53mZPFou7EpOqzlKfpBwGFaL9CHTYN%2F76x%2Bb%2BxhS%2FWyJWppoq9pvXS5Y6%2BPRZc3YGSXjW%2Ftz8L4Py7vY9F7avik4mriOWkPRzfmiK88VU6sloihDDgvuLDBjqkAZJHY5xNnPt4WepsI4qNc3X%2FwPZtbuJZpsLKOo30Gd2R4H1zS62A6T3XIQrZa7p3KkbYhIkKpfDyjwBBN1iesa%2F2cUhG5ZS6bG5I%2BAgD7VFcud3E5yeU5q%2FF85bz7VSYoh5lMGey43eKsE5pspQA%2BsNahexpFVxFrl2Czk8u1lgpLp17jTfZ0OTZ5CxBUX8ld5BkAEL59qazq3BeR7B1KayTegf8&X-Amz-Signature=f78984de7cad23930a530fd0bb032fcf01343c71a57cb6352e2288e98459a5cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

4. 再次使用`./go-cqhttp`启动，可能会展示二维码，需要使用手机扫描验证后即可登录。`ctrl+c`终止掉程序
5. 使用命令后台运行`nohup ./go-cqhttp &`

# python脚本与cq通讯


python环境的安装不在赘述。这里使用python sdk `aiocqhttp`[官网](https://aiocqhttp.nonebot.dev/#/getting-started)

1. 安装包`pip install aiocqhttp`
2. 执行最小的demo，查看链接状况

    ```javascript
    from aiocqhttp import CQHttp, Event
    
    bot = CQHttp()
    
    
    @bot.on_message('private')
    async def _(event: Event):
        await bot.send(event, '你发了：')
        return {'reply': event.message}
    
    
    bot.run(host='127.0.0.1', port=18080)
    ```

3. 这个时候使用其他的账号给小号发送消息，即可收到小号的回复

# python脚本调用notionAPI

1. 创建[notion集成工具](https://www.notion.so/my-integrations)

    填写name，为工具取名，我这里取名`Collection of materials`，以及设置访问权限后，保存。即可看到访问token


    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/d13675e1-10c9-48ca-abb4-7ac7aa58991d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U2PMF663%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T081049Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJHMEUCIDUFSqh4hGCOVtpgjeUv06TxE%2FucBE274DR6vSPN%2BWZhAiEAhvvJk9IycUWc7Vssj9AuHeXetsjuUDOEj8EbICPpGEgq%2FwMIcBAAGgw2Mzc0MjMxODM4MDUiDKQ4HqByeqT7XE1zrircA3QQp4DYms6XadNcEALyyAns49DQecJmx2IuWAPUBCJ7TpwSySfg8UBFcae9fgI%2BebN11kaofZo9j5eUDLxQn07xH8Jb2IAJv4rMR18AmnOI2sinzqkm67uTLcGFGL%2FC8UhuVvuso9J%2FSnepFKCVwgR7b%2FTkEng3zJ86brSaSGSGbmXHZUcooXYK9T4Zjfb1GzA7vzOXfw9wnrHqFA2ygZaOCj%2F3MwU4ZsKSASM5R56IOxYH6wzf4owHrriO%2F4zgLq2q%2Bqgh3wUkM%2FMm%2FTXZWq4%2FEI35AmDo%2BMv7xT4MRxSFSKgc%2BjAIstZtZNKR7tq3UoB9bXrTHoTSqoCYVSyXa2GYroHDl1OpJ2RvNfZP2Npql4FJV%2F0KIuk42i0jkFb2llS3w8rfmZRIXTHPBTapAUVB8cqJrHrZLLj%2FDqQvIs%2FzcmBabT6ZX%2FhzzLXts62HcJfJLIQD7nbca%2BJANOMaA66%2F36VlAiTtd5fLLuEL3Ru4T0feePvN5nvbbOSZ%2BVK%2BDg3MTwnIaGhcUtPd2hc4CDvmqIW6xv%2BPOBpymWmhoSGI7OPxzT7mXu17UTbCmZaHBObFPjI32nQCPwLfksRj5rQ6e%2F67mYtSImfVvxxQmdW%2BSaaHj6Y3qb86zUV%2FMMnA4sMGOqUBGGYJ77K3vip1STxKIZL1XTFWcnYjuHH0zhCeQC4Zj63S66XBVT2TcPH9UGFfa1UeoSA4ViZX2rFZv4TTmlP1Jto%2BXGSr0fL%2F2Bfh2t4%2BBGbN7tinM%2Bmtad0YzUwMuPui3CY7i1fn1%2BMGqtkN9MYqQKetPIMdZeNL2lKcQEhZZDt7RqWWuPlINNlEcBxeBh%2BOJ6KnN3FauEMZYR41CCcJ3wKx3Xpn&X-Amz-Signature=6715cd144cce47449e023a6e0eb534f70b842589de7f2167e609e0c1a87f8759&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

2. 创建notion页面，使用模板库的todo。按自己需求修改

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/65e07c30-636a-406d-b39f-51e7cd961a74/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667UXZMQ6Y%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T081049Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJHMEUCIGmDObQYDFrj%2BlO%2FbMBoe%2FULie6YEYEn8iZx6i%2BCJ2XRAiEA1EOrtI3%2BSRhX51QZjv4hKL9Z3XCFBClIZCa5HGuoJu0q%2FwMIcBAAGgw2Mzc0MjMxODM4MDUiDMAezrTpEzHRFI4rUyrcA0KvGQAirte3INjW%2FsnTgKfmfPggJj2TS9OgeMBSGj68oIzfP0iw%2B3vrQIi0O%2BuyymslJQxQrnkYxrKggWuW9rEFhsHtuv1XkP6%2FblbC0s9FhtgV0gz9%2FH8DhkuAnzOmjGNz80ERRH26O298rpJTJ%2BZGDcDesGcOOJC4%2FgiA9at5GGCzzQAqth%2FIXV0aXAtR76af4%2FYGIpY9VadqMxHk06s8a%2FRaV5g0l5TeW%2BmCZcmYNpnc4cvMvlb3a%2FAgeSA9J98djMtTAt1zPxtMRQG0nLiTF70WTMVe1WU0Dkn6qh7TUsbmC%2FzCo2VeDuGSoSS2sWPLGs3N8wX%2BeS8jN9pUX8AZNyyFu5BliRdcpxkQZggpJ8dC1lsOEX5xKbveYPy3%2BrhISgV4KRTTBPni830eMQ%2FrsPJj8ywpW5nD8nIQTFG4%2BaHVPSKzEgWZ0SH%2FaxLoMTIsDAN3DhozjMD5FYSZJCfkp%2FOB%2BPF4cgmB%2FfYoKsA9gMmzCSdJ558GJfFXzwSNMZgFrFWBevE%2FnjhoH3%2F08%2B437sNhArrkl4OXOoMLxdiZAWVUZNYwKspY9JehUbS5NpEUNtO%2FSIpsD0vVkVD3dq9wu%2FdPcRnCoPEdIRGztCsoNRVsvlBGc4olWIkRMNC%2F4sMGOqUBls%2FmY0EZ5detqK3LJ3PNXiH3W%2BLIPMgsC07IIGsKhIqgYKr2oVKF0x9qbpjVIjjeGsPc%2BweWeYERuDxZNF32my0NAN%2FHDFBnq%2BNE9kpN00k58TOPjkbXjN3afmQHttxLcWJpe5FDBPUDlLG1tZxMn8vkdCfiAcWB1Y5GQ13oGCzrONWficE3wPoyMJBv29%2BLkBlq0foffGOgkKOl4xGY%2FWcxnwCF&X-Amz-Signature=8f14a3b81458450521cc65a6d40198e797ec16a74054bbbf75c319751231131f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


    我这里修改Status为Status类型，保留创建时间属性，其他删除。这里的属性关乎API中的数据结构的组装


    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/04441044-2bf6-4847-a9e7-53b6bdc233ca/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667UXZMQ6Y%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T081049Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJHMEUCIGmDObQYDFrj%2BlO%2FbMBoe%2FULie6YEYEn8iZx6i%2BCJ2XRAiEA1EOrtI3%2BSRhX51QZjv4hKL9Z3XCFBClIZCa5HGuoJu0q%2FwMIcBAAGgw2Mzc0MjMxODM4MDUiDMAezrTpEzHRFI4rUyrcA0KvGQAirte3INjW%2FsnTgKfmfPggJj2TS9OgeMBSGj68oIzfP0iw%2B3vrQIi0O%2BuyymslJQxQrnkYxrKggWuW9rEFhsHtuv1XkP6%2FblbC0s9FhtgV0gz9%2FH8DhkuAnzOmjGNz80ERRH26O298rpJTJ%2BZGDcDesGcOOJC4%2FgiA9at5GGCzzQAqth%2FIXV0aXAtR76af4%2FYGIpY9VadqMxHk06s8a%2FRaV5g0l5TeW%2BmCZcmYNpnc4cvMvlb3a%2FAgeSA9J98djMtTAt1zPxtMRQG0nLiTF70WTMVe1WU0Dkn6qh7TUsbmC%2FzCo2VeDuGSoSS2sWPLGs3N8wX%2BeS8jN9pUX8AZNyyFu5BliRdcpxkQZggpJ8dC1lsOEX5xKbveYPy3%2BrhISgV4KRTTBPni830eMQ%2FrsPJj8ywpW5nD8nIQTFG4%2BaHVPSKzEgWZ0SH%2FaxLoMTIsDAN3DhozjMD5FYSZJCfkp%2FOB%2BPF4cgmB%2FfYoKsA9gMmzCSdJ558GJfFXzwSNMZgFrFWBevE%2FnjhoH3%2F08%2B437sNhArrkl4OXOoMLxdiZAWVUZNYwKspY9JehUbS5NpEUNtO%2FSIpsD0vVkVD3dq9wu%2FdPcRnCoPEdIRGztCsoNRVsvlBGc4olWIkRMNC%2F4sMGOqUBls%2FmY0EZ5detqK3LJ3PNXiH3W%2BLIPMgsC07IIGsKhIqgYKr2oVKF0x9qbpjVIjjeGsPc%2BweWeYERuDxZNF32my0NAN%2FHDFBnq%2BNE9kpN00k58TOPjkbXjN3afmQHttxLcWJpe5FDBPUDlLG1tZxMn8vkdCfiAcWB1Y5GQ13oGCzrONWficE3wPoyMJBv29%2BLkBlq0foffGOgkKOl4xGY%2FWcxnwCF&X-Amz-Signature=48aa9cd3491ac8d49ae3e0a82da37e05a6724c688a059427fd084dece39bbf1f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

3. 给todo页面 选择刚才创建的连接工具

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/7ae2573f-8f5f-4573-bb57-8253156261d0/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MOV7O4U%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T081050Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJHMEUCIQDxk4bg0cXhTwOCnPzlKxYgaT9PRc1PMcJDaUdnuBnQ8gIgRic5vlEMOM%2BRB1IA2o%2Fcy2j2F0vDvuylNr76aQ%2B6l2Qq%2FwMIcBAAGgw2Mzc0MjMxODM4MDUiDCyEi9QmN82VwQe%2FLyrcAwRaz3kcvWoGK3U7S7N7r5ue7FKNv43VteQtvRpfE7s90%2BTNzP9fcn7HmWhfPYXGSWqkk3MzkURp%2FZRtvZd7czdA7UrbQ0x8mh%2B7eAbGLear6JM7Hhvn2exSslWL7qn9GGGZduAUN81Wa9OhCr7RRDxtZ%2FpOi23HQmoFYdeGXzQg%2B3u1ME3qeJNiHPwxeVWiSQ73QKMZkEo9a6API8Zfzl3lNr4b48L7oXBskry2f28T0GwuHZZtSVWW%2BH72aP9r4zpJr%2FSBI1HOtqC7AZD0ffbqKVpCxJlBoXp6aVwOI7I1N3%2Bl7xms0kSMroj5NGhYK8f6VuDWSCQRA%2FPoMn2ymPn06Gafka%2FXSRmLoxpkjNvRG%2BEvltD6N8ME5H2X1hH5e8HbsmQZ%2BlfdWnWDmJN9JXDm8Gd106Ka3JZ7%2B1ieV9K7WvW0NJ1odIMQ6iI3c6JjGosnn%2FrKLDfW3sLIHl4pyE0nfsXwpRuujtY8Fc40aZ5VK2NtKBLy2q3%2B9ifLRg8PuNRr4MaGKlaWIsornrTpNk9l4QNva%2Bmux%2B%2BayTC2t%2B3efLmBD0RyA4AwLpGFOz%2FPjXkKWgvgONfkk%2F%2FZdkk52PiqYzw8nPt3MnWCPeigVb1NOSwDStKz3SCsROG8MLXA4sMGOqUBoEP97sttoOoMO93aXoI%2FChPY%2Fc6gyu2uFB%2FgUnCcubD4jZN%2FklM%2BEGqTnB7ZEJ4mdaCFj5aeYq3biODCGbJ3s03NldCT2KaPrUGUG62iB1eH%2BkBYxcfL9Dzbsd0vK%2Bk9HRxwpLWpXDptpvVSSojStubKDAzpJpI4QMkogkFlsdwO8Yj73BHzyhpfOPjZ0TxvG1Pq3S52IS0RohjpkfdL9XUBLNmO&X-Amz-Signature=67342ec9575e1192916f156aa494422daf9080e910102d56f0f3a6b670446b47&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

4. 编写py代码，验证集成工具的可用性。关于notion的数据结构，参考[官方文档](https://developers.notion.com/reference/intro)

    ```python
    import asyncio
    
    import httpx
    
    
    class NotionApi:
        NOTION_KEY = '' # 此处填写集成工具的token
        database_id = '' # 此处填写database页面的id，可在todo页面的url中找到
    
        def __init__(self):
            self.url = f"https://api.notion.com/v1/pages" # api地址，可在文档中找到
            self.headers = {
                "Accept": "application/json",
                "Notion-Version": "2021-08-16",
                "Authorization": f"Bearer {self.NOTION_KEY}"
            }
    
        async def insert_page(self, content: str) -> str:
            # database属性
            properties = {
                "Name": {
                    "title": [
                        {
                            "type": "text",
                            "text": {
                                "content": f"{content[0:14]}" # 截取前14个字符为page的标题
                            }
                        }
                    ]
                },
                "Status": {
                    "status": {
                        "name": "Next Up"
                    }
                }
            }
            # 页面内容
            children = [{
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "text": [{"type": "text", "text": {"content": content}}]
                }
            }]
            # database 信息
            parent = {"type": "database_id", "database_id": self.database_id}
            data = {
                "parent": parent,
                "properties": properties,
                "children": children
            }
            async with httpx.AsyncClient() as client:
                r = await client.post(url=self.url, headers=self.headers, json=data)
                print(r.text)
                if r.status_code == 200:
                    return "收集成功!"
                else:
                    return "收集失败!"
    
    
    notion_database = NotionApi()
    
    if __name__ == '__main__':
        asyncio.run(notion_database.insert_page("测试notion API"))
    ```


    注意：

        1. 我们刚才创建的todo页面其实是一个database
        2. 我们要创建的各个todo其实是database下面的page
        3. 因此我们使用的api 是[创建page](https://developers.notion.com/reference/post-page)
5. 正常情况下，已经执行成功，可在todo页面看到

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/9029c7ff-64f1-442f-ac7b-df9705b03350/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664X4IIA72%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T081053Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJHMEUCIQDwIWvd607yHG04Txtp5eTVYR4TT9AEBzmWlhiBqmDmkAIgODIjIqIbVn6oSX6A11lM%2BPEBWFnQCJCiz9JmBLuyIaMq%2FwMIcBAAGgw2Mzc0MjMxODM4MDUiDNsvxk74oW3%2BO2zIoSrcAynlHcaGa070s00wqIkhgzd2rgDyDDjB9%2Bh%2B%2BVML%2F2SkJs8jGMeFipahvUQZmHxSIOTsyDlzeUjzlgHa73T%2Fy6HeQBbDNj2yrbfmFeCRZ66Au1sSbMRM%2B0MJF%2BmFvOZAk7g8OVPQX1HQkiuhlF3X056uLlJk2nTBjANCpefLMiW4RTEfUYhEl5TcpJWcMvY9H50BJ7V1LyXkvpKxkVAOzrd0zl%2B1FyQA2WQ15UQ7ybSzUd4CyA%2Bcb0bz7dRCMtRR7Xl%2FgseVNkibcvYqL2Nbc6DgLPee3lmma%2BNWQWglSHoBoz6naqCO3mek%2BB4pMwoJ64g1LqwYcOCi1H3NxTcNoF7gISKFASEr1ppc%2BaFXAqHW9UmAIHQyTRiv2TaDw%2FuNbyQsPUVZV7SdaWHd%2Fz60behQlTTX15GfYJ8OyJ7kzWpWqLgJDduGGsxNTy1C%2FQym80dbUcBlTRuvyVhOTeRZ16I4vUSDhNKhONXYneUDKyMUKkZcacAdifTnSAEgjc8nvLjiQ9yHHQys%2FAD1B8beS5RcMh5BMxx7Mx%2FoUn4erxuo%2Ff%2BQ61JqxNFcZ%2BIMBIQ93L9kdcZ2BBpbVuzQU6QKaCqBQhzKV74lPYF1uwIPMAOj7EVpVWiyQoWX6z%2FsMIi%2F4sMGOqUBFHHZXOEy5URw5skBdJIx7KzzIOlP5lZVfshnJiB2c7vin4li%2FbqTX4KYtDaGY9V6i4Vb%2Fi1nwYCr%2FjnRDuVWK5sePZTmaJNlqxFzrHAXzlvs3EjglgtwPKmbgKh2eX6ZNBdiJ70vkZ2vWzb3aBSPqd%2FrDrpcBTfpvIpiAA2nq0MHPTT85PsW2ZoGgoBAr8lqyG6K1CQnRGlL859n8Ae8lSlVu1F4&X-Amz-Signature=aa72f9b3b6f4223773aa9af07af23fce6f866e1a2aa72a9654cbbceb921e71f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

6. 完整代码（bot.py）如下，在服务器执行`nohup python -u bot.py > bot.log 2>&1 &`

    ```python
    # -*- coding:utf-8 -*-
    from aiocqhttp import CQHttp, Event
    
    from action import sent
    
    import httpx
    
    
    class NotionApi:
        NOTION_KEY = ''
        database_id = ''
    
        def __init__(self):
            self.url = f"https://api.notion.com/v1/pages"
            self.headers = {
                "Accept": "application/json",
                "Notion-Version": "2021-08-16",
                "Authorization": f"Bearer {self.NOTION_KEY}"
            }
    
        async def insert_page(self, content: str) -> str:
            # database属性
            properties = {
                "Name": {
                    "title": [
                        {
                            "type": "text",
                            "text": {
                                "content": f"{content[0:14]}"
                            }
                        }
                    ]
                },
                "Status": {
                    "status": {
                        "name": "Next Up"
                    }
                }
            }
            # 页面内容
            children = [{
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "text": [{"type": "text", "text": {"content": content}}]
                }
            }]
            # database 信息
            parent = {"type": "database_id", "database_id": self.database_id}
            data = {
                "parent": parent,
                "properties": properties,
                "children": children
            }
            async with httpx.AsyncClient() as client:
                r = await client.post(url=self.url, headers=self.headers, json=data)
                print(r.text)
                if r.status_code == 200:
                    return "收集成功!"
                else:
                    return "收集失败!"
    
    
    notion_database = NotionApi()
    
    bot = CQHttp()
    
    
    @bot.on_message('private')
    async def _(event: Event):
        n = await sent(notion_database.insert_page(event.message))
        await bot.send(event, n)
    
    
    bot.run(host='127.0.0.1', port=18080)
    ```


# 总结


整个过程中的难点是对notion API的理解，一开始以为添加todo是create a database，几经尝试后才搞清楚关系，这一点需要注意。其次是api 数据结构的组装，需要多查看[文档](https://developers.notion.com/reference/property-value-object)

