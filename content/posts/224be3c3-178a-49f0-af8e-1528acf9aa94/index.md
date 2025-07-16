---
title: 🤖 QQ Bot+notion实现随手记
description: 小玩具
date: 2022-08-16
tags: ["Notion"]
cover:
    image: images/224be3c3-178a-49f0-af8e-1528acf9aa94_5f7f0b6047be0b8e9579ef48a693e2f5.png
ShowToc: true
---

习惯在QQ置顶一个小号，用于“随手记”。可能是某一时刻的想法，或者是链接等，每天早晨都会看之前的随手记，有些可以看到就做。还有一些是flag，当前可能做不了，需要稍后的，QQ查看之前的聊天的记录，已完成未完成混杂在一起，查看起来有些麻烦。随着notion开放API，便想到了使用QQ或wechat输入（这个两个app每天打开无数次），notion收集。经过研究，wechat接入第三方应用非常的麻烦，可行性太低。QQ则可以借助各种qq bot工具实现第三方的接入。因此我便使用[cqhttp](https://github.com/nonebot/aiocqhttp)+python脚本实现自己的收集工具，具体过程如下(在腾讯云服务器实现)


# [cqhttp](https://github.com/Mrs4s/go-cqhttp)

1. 在[github](https://github.com/Mrs4s/go-cqhttp/releases)下载合适的安装包到本地机器，并解压 支持win，linux，macos
2. 首次执行`./go-cqhttp`，生成配置文件config.yml

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/74d2b771-a6b7-4c6b-bfb8-41fbb62aa2e4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667XWAQGVQ%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJHMEUCIQCUOE9FxHrfUBYzG4BJOrI18cY9m6Q6yyG8iBknGMUXdwIgFWE%2BeVzTIGyMh9mb0DFo08OUiP9iDHMEt5Y%2F7tv3ttsq%2FwMIKBAAGgw2Mzc0MjMxODM4MDUiDEm%2BxbSIbglUVypqxCrcA%2F27913h%2FMVH2o8bkqZyjrQjUsUrdoEsln2Px1u2beNtvnAagf539P3lNUf9gHkI6UMTVStRaM9%2B7mSr4GZQhHEqcS%2FbpKNCeS%2FNfABCB%2F%2FHRA2LHn617Ldvndzr0kFx2T7tgkC7txl7jyRQq4yU78XAr0VdGSbcshflJ%2FMHt11FvvPHE6OYI6jVOTx20EkTLt57inf7AefBgUKylNJzhFnM7FD14j0a4p%2FvY3UWEcncjzDa5VOyH546BztZnfzWmhdy%2FLi3Xw63fRbJ3IJO3kaNnAyvSj%2BLyqlUl%2BxG7rvfJrqdBrlnAET2wM2ZfTGAfhnIgbQg%2Bso8m92oEYTK4XsxoLCnoZ5q2cc5%2BA0ecsC0S%2B%2FgjRGALmdMvCqK%2BO2Hyf2zg7gvmKRTxKy9C8MosHy0KxLiUWlAcNKv1m4QRCFtxbUKmqfgfGsfwRC4dOhcxEJoG%2B75VB0Lf4nQ6JBVv3RYorvac0N6p%2FBuKyoFcuRLuaZzZSghrbglgFudEEifl0hCWjhmRh1J5I7B%2FSOijyhNXk9v6o8sh2kVE0H%2FN8%2BVaa9vXz%2BK4QKQZM5COMhu%2F4IGg3lFZtDNOAzvqTbsy141RJAeqb0Bwx9Ip6xT%2F7wzKMXbOhnC6wtRD%2BiWMOPb0sMGOqUBDfX25MSbquT1fJ7WkqffLz9fZOTS8XocyMBEv7XOxkxO5Jw8NrBrd1u1QlDXFdmyJZJ5AFwkjLjmRWFjk%2FyCOcoe6HKtNf90maOeo9g3A6v%2BXFlVA%2BPkBqe12p0RDNXT9tnA1tdzJMSEHyac38RekAF1M9lapLt6i1epwwf3xLD5cDD1yYJN%2FrnGgbePf%2BxsaXTfM4R5fcENwMHgyCDp%2FXdqKkJf&X-Amz-Signature=30d1955bd87b03d0492951cb01c7af3268ea6aad6100de61f728f6a3d5d4d770&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

3. 修改config.yml ,配置账户和密码。记住下面的servers的链接端口。更新详细的[配置参考官方](https://docs.go-cqhttp.org/guide/config.html#%E9%85%8D%E7%BD%AE%E4%BF%A1%E6%81%AF)

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/79142ab5-969e-48e6-934c-75120cc752cd/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SXX53ZJ4%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073906Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJHMEUCIH4BA4%2FUXGUMQ1Q05Yfn3QT6qD3%2BLAiV3xdcOcO5f7NqAiEAwRKsRPh9hkL1rFVRTnWXzjX2uJRPkCL0uj%2BSRD0fggIq%2FwMIKBAAGgw2Mzc0MjMxODM4MDUiDKuYBxNqcY5AN7NsvCrcA1RyK7cmhSH%2FMtnkAjWMQF0IIAwcJPxjQT2QEaNYuzoCJVLqZZaU2kYsnjVNcyck06Y7dR%2FMZt6RVuQdUzpKqgrFqPYEdNKHe0SwAshRzZnVuo4NPoBUPqb1m41F11lYYQlNqz9aFFVHFYr4qUEvxXVL4eqSF6vl2rA8vjSI5%2B5dREuQ47SH1yoziTcPctOX%2BebTtrxCEMCK2MlKY07L7rw98d7aBG6zxsFOghjZmeCXHG7lt9iqjoLGK4H8Dekk4VvI3qgIHKTFjiJOy%2BmYOfFES9KnlYaCF2YYRTZCzNvsAe2Qrbct%2BNJ1Qa6jy%2Foi8lzsnXQMXDe9GAlBMWIBQqqETQ1%2B7HOwO2Q1woLaIlwBGGS1FidOOP9LgiwsiBuK%2BnQLwyjFMkb15h%2FF907yJK7N8Xl4OFA1WgXdql9WAUAeRJC7R0INzgssJEVGU4AHOdRLSrQD7g8Cwwz7RJXdlJPaOM%2Fi6%2F9I1x2m1r92zOTFyzN5o4BKwJqm3ncnVuxwhcAFZcTh4LyfBjdFzLq%2FhMnx9BroCdOeHMV9HJajvpT6ZSEEihf5pl2ctDPxszAXHifb1KKAwsd2k0DAsiRtHh%2F3X5Tpdid2hui5HjnRj8FOoyOWWcaCLoUXBGlxMKfc0sMGOqUBP%2Bmfcxo0pT%2FDyZGhHIx%2B2QUf2Z4i6gox8B89WO%2FBVeZuVz45oEle10vF5CfsHs6czQQ22lnjILhgkOlbDM3nxm%2FyqHzeITUAVZPPgsEi4W0LTwfGYolV1CzNRNubkvEkl2n9PGP%2FavnQ2xj%2BgNEi0ZcGpgtta7vtMOTeA6nE%2F3Pk8IxV5qHWGoDlyrlXs5RxRw1Vv8FcHlMUC%2BYX4KzMi9cpWTi2&X-Amz-Signature=b93d8e2c722d9e6f0e4a8f112475827686769db8f08a5c2aa09870c97970fbd2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/2dff1ba7-3e89-40cd-a7ae-15fc422a578d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SXX53ZJ4%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073906Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJHMEUCIH4BA4%2FUXGUMQ1Q05Yfn3QT6qD3%2BLAiV3xdcOcO5f7NqAiEAwRKsRPh9hkL1rFVRTnWXzjX2uJRPkCL0uj%2BSRD0fggIq%2FwMIKBAAGgw2Mzc0MjMxODM4MDUiDKuYBxNqcY5AN7NsvCrcA1RyK7cmhSH%2FMtnkAjWMQF0IIAwcJPxjQT2QEaNYuzoCJVLqZZaU2kYsnjVNcyck06Y7dR%2FMZt6RVuQdUzpKqgrFqPYEdNKHe0SwAshRzZnVuo4NPoBUPqb1m41F11lYYQlNqz9aFFVHFYr4qUEvxXVL4eqSF6vl2rA8vjSI5%2B5dREuQ47SH1yoziTcPctOX%2BebTtrxCEMCK2MlKY07L7rw98d7aBG6zxsFOghjZmeCXHG7lt9iqjoLGK4H8Dekk4VvI3qgIHKTFjiJOy%2BmYOfFES9KnlYaCF2YYRTZCzNvsAe2Qrbct%2BNJ1Qa6jy%2Foi8lzsnXQMXDe9GAlBMWIBQqqETQ1%2B7HOwO2Q1woLaIlwBGGS1FidOOP9LgiwsiBuK%2BnQLwyjFMkb15h%2FF907yJK7N8Xl4OFA1WgXdql9WAUAeRJC7R0INzgssJEVGU4AHOdRLSrQD7g8Cwwz7RJXdlJPaOM%2Fi6%2F9I1x2m1r92zOTFyzN5o4BKwJqm3ncnVuxwhcAFZcTh4LyfBjdFzLq%2FhMnx9BroCdOeHMV9HJajvpT6ZSEEihf5pl2ctDPxszAXHifb1KKAwsd2k0DAsiRtHh%2F3X5Tpdid2hui5HjnRj8FOoyOWWcaCLoUXBGlxMKfc0sMGOqUBP%2Bmfcxo0pT%2FDyZGhHIx%2B2QUf2Z4i6gox8B89WO%2FBVeZuVz45oEle10vF5CfsHs6czQQ22lnjILhgkOlbDM3nxm%2FyqHzeITUAVZPPgsEi4W0LTwfGYolV1CzNRNubkvEkl2n9PGP%2FavnQ2xj%2BgNEi0ZcGpgtta7vtMOTeA6nE%2F3Pk8IxV5qHWGoDlyrlXs5RxRw1Vv8FcHlMUC%2BYX4KzMi9cpWTi2&X-Amz-Signature=2fbd230477051c6ca8d18aa47f449e13e4ceff04ea34e98b76d2c87812b56e43&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/d13675e1-10c9-48ca-abb4-7ac7aa58991d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XSRRFEEA%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJGMEQCIDSy%2FzSJH5WHPzRxK%2Ffb0eVzM4%2Fa76%2FdiA%2BbDiiJBroBAiAqEP%2B%2BP7Ie0f1EEgw22FgDv%2FBFDJcfM3%2Fo6n2wqnQX%2BSr%2FAwgoEAAaDDYzNzQyMzE4MzgwNSIMgnXSf99%2B6mKrI4GnKtwDQSDmzJ5S1x7%2BnEtI1BKXj8DstMNqoSb4uk4z3gWIbGFxfWziEqgXlWOPKbmi%2F9m10Pt%2B47OKpSuFLz4qbOZ7SlPV%2F3eIOBDEHrHPY4Wdq1rLVEfmRyOFhsjPIR9WC7NTKU88znkHxJvkWfJJMky3GwCxtTNa06IChuoqKDPVMyGaxRwzC2lzGOu7zqLlpOWsvRwfCxLvcrUQRK5OX%2B4KleBmFYgq2cQhPPg76u45o9kfZhL24M9c%2Fqxs6mYoMEjGMsSslbiHEVFh%2FeS8PgXtr4%2FVSsHr%2BOIfejKYxPDdBBmf1M15ThgiQmq4YZ17rkfhmL1pMPUshcIHJZC4taLxdoZBH3MGP1z0gwkgnNqNyHCK9yzS51f98z5JDT7Pb1bBkvsngtoDEUn3lvV5CVdyawLxfCHZCdStlh8XbACOTQ54medZ%2BeRGOaDbUKNS12yjPJAHwhOH3icT4MTGoXMlcokXgWhE00aA6ado%2B1s1F6qjvOFwBUXXa8JEaUbLpl64ebwSZxVJnoG%2FiWZSZg8FLm%2FX9%2FizwIhFKZz9oBv05UCMJGfKzaZ5d6ow2gSosJhqnIksK6QIIFLNdzh8H1EZ7iCMSgm1t4daWoe0tqkpkPVAs0wYt7ZEZ2tw7ccw79zSwwY6pgFKW%2BJplDe8byZS6%2Ff%2Fx1hhU9%2Fz1lmDjrhjC8BX7k9AeI7GPH%2BibU3OpxgRG2SHkSuFDJZkuEqe0opHNbvjDIcixZqd8qAfJ8ocBtsBClzJF%2FxanolXxU844Wcv4avbNmktWUNY1YQkkVJYoPTdP%2FLFZTaUfWagtMNmxB%2FXgU6mhIxDGvlFBnyU%2BVnEtB2GHLiOsBs6ngsQrEIxMJ4y0AciNvHZmXne&X-Amz-Signature=496b06d9b7b481a9f47f04f162b875e18cba3ea1d82c7e0656c8933a2d23500e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

2. 创建notion页面，使用模板库的todo。按自己需求修改

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/65e07c30-636a-406d-b39f-51e7cd961a74/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XTPRGBRE%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073909Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJGMEQCIGI4OHhbIouGgW9JUAcIVVo7qK0TKcX7WXEOH9ghLq9UAiA1R8fQbt6Ovs3p2zb7dtbqqi3umURQEZi9Yr%2FMildAsSr%2FAwgoEAAaDDYzNzQyMzE4MzgwNSIMzuDb%2FSD3pTCcDxfRKtwDNljfWjjo6AvuQaAdwDDZr761uy496FVgEZIB3kIEfoheiO3y7PtOG6%2BipK8m4qsEfn0RpiZxNbMBbGOxrpUmpauj%2B3TMA08wluzfsa%2FMl67pqZ4pFY167%2Fhx59g50Ix6ODloaSF1lD807nLh%2F47Q%2BLIHWPdtrTHtLp5%2FXPzDVDUpAYhUKK%2Bis1GvBlJBhqGUnwgBs5QpisCxwkTrVat4GBVPpQ7Ur4y64K4PW%2Fmqognq0r7rr69We%2FyPkhC9OKzRmhyYkLV6Bm%2FVbn9MZpStiZu9Z4cVOlljXZS5bVuW5wpzOkcPwWidw98JTRAaKgsmUtEUv2FnKo%2BvO1C4BTPyYDBOXZs47DiTTPeGbDbVIZ5YLUHRob0v5hT241%2FIi1tIgismB8WLA7yxm8GpzR8aUiKN5qyHQeocDmuCAxlS8gDQil36OnViE8UkXTP94%2BSKGPRmb75svXfSke%2F4LS6%2BcxTa%2FpzGz5Tq6K9sP4FvRV60tkVyk%2Fsh6Z105cJF3RT59BaVYs4e%2FGHFWRZ5vgc2EUGYOoqyM3Z9nXVS2xsgW9SMvrdujDXTVLEjqANyCWX1O1fQvu7mtXAIJC90VlNk7sWvaXK6E6eKq1Q4N1D%2F5gTy4yQz27bO%2FHy7QcQwrdzSwwY6pgEEzuTwr9mdx191kg4kBw4CD31MinaLizPvHFHbJlLhYL5Gd27yjCySWHwolDwH5WiqHOxuVqRQMxRYzpkvRc4O6Af%2BaIvgWu7%2BF7Q5K2XQ%2Bbo7pXF7br119X3ZYQPN5K2F2HLbo5XsqmB5BvZYUa%2BLzPrrIOPBEr7iCqfQ8lGMAc8%2BK4wFVkWWvl4GhIM1%2FH3F3kZh0VJD75yGH%2BBYT%2B4KnQm%2BqAIy&X-Amz-Signature=f2252ffc05c2ffefc0aaa9b7b13e0106e974972495aeeaa422bac1cafaf4f360&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


    我这里修改Status为Status类型，保留创建时间属性，其他删除。这里的属性关乎API中的数据结构的组装


    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/04441044-2bf6-4847-a9e7-53b6bdc233ca/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XTPRGBRE%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073909Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJGMEQCIGI4OHhbIouGgW9JUAcIVVo7qK0TKcX7WXEOH9ghLq9UAiA1R8fQbt6Ovs3p2zb7dtbqqi3umURQEZi9Yr%2FMildAsSr%2FAwgoEAAaDDYzNzQyMzE4MzgwNSIMzuDb%2FSD3pTCcDxfRKtwDNljfWjjo6AvuQaAdwDDZr761uy496FVgEZIB3kIEfoheiO3y7PtOG6%2BipK8m4qsEfn0RpiZxNbMBbGOxrpUmpauj%2B3TMA08wluzfsa%2FMl67pqZ4pFY167%2Fhx59g50Ix6ODloaSF1lD807nLh%2F47Q%2BLIHWPdtrTHtLp5%2FXPzDVDUpAYhUKK%2Bis1GvBlJBhqGUnwgBs5QpisCxwkTrVat4GBVPpQ7Ur4y64K4PW%2Fmqognq0r7rr69We%2FyPkhC9OKzRmhyYkLV6Bm%2FVbn9MZpStiZu9Z4cVOlljXZS5bVuW5wpzOkcPwWidw98JTRAaKgsmUtEUv2FnKo%2BvO1C4BTPyYDBOXZs47DiTTPeGbDbVIZ5YLUHRob0v5hT241%2FIi1tIgismB8WLA7yxm8GpzR8aUiKN5qyHQeocDmuCAxlS8gDQil36OnViE8UkXTP94%2BSKGPRmb75svXfSke%2F4LS6%2BcxTa%2FpzGz5Tq6K9sP4FvRV60tkVyk%2Fsh6Z105cJF3RT59BaVYs4e%2FGHFWRZ5vgc2EUGYOoqyM3Z9nXVS2xsgW9SMvrdujDXTVLEjqANyCWX1O1fQvu7mtXAIJC90VlNk7sWvaXK6E6eKq1Q4N1D%2F5gTy4yQz27bO%2FHy7QcQwrdzSwwY6pgEEzuTwr9mdx191kg4kBw4CD31MinaLizPvHFHbJlLhYL5Gd27yjCySWHwolDwH5WiqHOxuVqRQMxRYzpkvRc4O6Af%2BaIvgWu7%2BF7Q5K2XQ%2Bbo7pXF7br119X3ZYQPN5K2F2HLbo5XsqmB5BvZYUa%2BLzPrrIOPBEr7iCqfQ8lGMAc8%2BK4wFVkWWvl4GhIM1%2FH3F3kZh0VJD75yGH%2BBYT%2B4KnQm%2BqAIy&X-Amz-Signature=e2097449d36fafc713a2b6cb01ead0f4d7853c7dc59152300d9538efcf39d063&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

3. 给todo页面 选择刚才创建的连接工具

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/7ae2573f-8f5f-4573-bb57-8253156261d0/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WA75OUYV%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073910Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJGMEQCIGc4I2K90k%2BKPedUd8V%2FgQGwNNGOBRcGineqUS46cBmqAiAYxBOu%2BKn4Ni5d5Tpm3yudsvqvYPuxnSfTJZ0xE2UDDir%2FAwgoEAAaDDYzNzQyMzE4MzgwNSIM4nghqE2o6lFr2B0AKtwDs%2BmmmmwFG74ulopkFqzjwbDeAKQLx%2BEo1LKu0PyBKi9zsE042PL3fpXDHRFvhsk0MAZsCEGVTXrMDFlkeqapmYAJN%2Bg5bMOGUsRcLx0LxMx6N43QZhLoeVyT1QQduqVGiSFKw2MSdULU2neYnS%2FFVoIB98ba%2FsFVO50louQIfFICwObYf3%2B8C%2BOanIylArhmqlL9db79%2F5TSOvtn%2Fqs8HS%2Bil2i63rVX2knzNek6r%2BK1wRorR%2BWDEG8B3Vjy4YTuQiY7I4%2BnmZSkOCDpU0uyJsgMsQMyk0wGnKU4pzwI6ZbFA8OJkjjw0BBAPZBlHlxPSe5dsAYIRUecOxnHWXSU9Lq5Zr8KnLOkOqgV8L9BC8l8pQiG%2FwZDTFyMxT8CMxli8W%2BWpOPN%2FkEKo3yz05Kuv7%2BZq%2FU7KukVAiKtTS1fr7FfM456Gkv0t9GnxAAYsdj5IkTLl9lIZEmFNFQnaf5mnzAD4kSkpIkQjAkUFtALHoZEamuDx2Iwiyznplthw1cBjEq0x41JQ7EUuBwmn0hW6GdhYF7ZZrIr4Yy9eY71nTAaZQ1NEoZHLbgEJHkyYvs4d1zg326qGZ7FdCI7LgO4gisnpBDlVhPHwVxIwRN0sfuE5gS9yoE5vcxe0l0wu9zSwwY6pgFrRB8b7swVONWwY5rzNt6gzorckd%2F6%2BouShmVNZKlH%2FGgk%2BFUMp712plXJkMs8TBica4Qf5iTCw5Z%2BjT2k1WSeiW09EtliG9iMATGIHsLYGuwsfPszqvtaPgCitcm%2BiNaK9MhpxVNvz%2Fqz1SgALVXBvW8mopytx3XV4XdfknRQySjMuEq1SB6nEhcbiRqJB%2B9k7Cv0sL335SMAoT5dBtMym%2BOnQmA2&X-Amz-Signature=a6003f4389ddfbb23c2f011129b941329e22df56198d856fd29793d6998faf4b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/9029c7ff-64f1-442f-ac7b-df9705b03350/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XSCFGLTF%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJHMEUCICbD5tePhWpYigmqF91Xgy87eWPBPZGi%2Bepup4Lw4y0cAiEA7nOoFP0qM1q7%2FK20hsz7qu8poWqohjZ3SzHRgBWSSzMq%2FwMIKBAAGgw2Mzc0MjMxODM4MDUiDNl7WV6hqRskz4NxhyrcA7XrRuMptSZ87HFg4WRwuBzu%2FuwzVvd6S986vjI8rsEB51EIyXWGwPsVEOB50g1Wh5VSAJRgmoUKItxvkQ7e4m513o8TWwq%2FfDfFUdPwyBiyxfT2Vv5v7eLATjPjbdYefBhCp70wt493PrLOtVbsAmNqnbLtJwUuX%2B40TV%2BHG2dEqEEp811c82qzgwMzZmAxjzSvt%2B0S8%2FOtGSD2MfRkJF6609bvyfBMaaEfoHm5gFyU4VyLZPSnUiajz3Z0iAG1iD%2FOkI8ZgVDMTn7BrqfFnyTkejFy3t46%2B7yKaQroF58PC6Fk8p7lRZd0w7orC6NWmS8tcTVBuQr5HLPgc%2B5xsl9UcIx%2FdVdXjD8Oyrv82mA2et63%2FiczcddYp3IEcDwHDUPfP%2FzNyLrxLBFbJQJE7TXah0%2BuTZ4BK0preFKQkhggC%2Fai%2BvUyqYBvnCAdft1CPlLOdV%2F9iEtt3P4qoq6sySY8hEjkoAJVO9gqu2oBKWKdE%2BRoT8NBKK1GEcRmMazC0KwcmVr4qeih3vkTnuk140OWxCzsI%2Fc1uGWsJmq%2FXIfAW9K1dmZyigH5JS3P6UAQ%2BZt8jDuf8UvYbN4HUpBlmOUIDj4HGQTEwPppgH67l9cjFXC9%2B9h2DF0ixSonMMPc0sMGOqUBDolS40A4cNjRBHSEtFh%2FIEF8%2FfTxrU8R3ZjVUawXh%2Fx8ooMtacMlFREVYYfkpw27A5Vw4txlibKfQLjO4L0kT%2FMbDRgZ7pM%2BfRdKPqF07OIl3k7vSlf5c10xSBqo7Z3RjCjy0vAcTlQs62GERf3H9vg3%2FwnzLq%2Fyyy%2F0C88riKmuDBDvAR1NcMIVFEorvdfW0rmmpzdCBin7DSVsdVE1XUCVcPJA&X-Amz-Signature=af768562979e7132d91d141282b0683928a578791a4788c2bf0d1b584954c621&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

