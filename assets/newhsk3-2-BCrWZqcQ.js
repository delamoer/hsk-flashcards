const e="newhsk3",t=2,n=[{num:1,name:"她请我们吃了北京烤鸭",texts:[{n:1,title:"课文1",original:`白家月：请问，您是王一飞老师的姐姐吗？
王一雪：是的，你们就是她的学生吧？
白家月：对。我是白家月，她是安妮。
王一雪：你们好，我叫王一雪。一飞给我打电话了，让我来接你们。
白家月、安妮：谢谢您。
王一雪：不客气。`,lines:[{name:"白家月",zh:"请问，您是王一飞老师的姐姐吗？",py:"Qǐngwèn, nín shì Wáng Yīfēi lǎoshī de jiějie ma?",en:"Excuse me, are you Teacher Wang Yifei's sister?"},{name:"王一雪",zh:"是的，你们就是她的学生吧？",py:"Shì de, nǐmen jiù shì tā de xuésheng ba?",en:"Yes—you must be her students?"},{name:"白家月",zh:"对。我是白家月，她是安妮。",py:"Duì. Wǒ shì Bái Jiāyuè, tā shì Ānnī.",en:"Right. I'm Bai Jiayue, and she's Annie."},{name:"王一雪",zh:"你们好，我叫王一雪。一飞给我打电话了，让我来接你们。",py:"Nǐmen hǎo, wǒ jiào Wáng Yīxuě. Yīfēi gěi wǒ dǎ diànhuà le, ràng wǒ lái jiē nǐmen.",en:"Hello, I'm Wang Yixue. Yifei called me and asked me to come pick you up."},{name:"白家月、安妮",zh:"谢谢您。",py:"Xièxie nín.",en:"Thank you."},{name:"王一雪",zh:"不客气。",py:"Bú kèqi.",en:"You're welcome."}],vocab:{seg:[{t:"白家月：请问，您是王一飞老师的"},{b:1},{t:`吗？
王一雪：是的，你们就是她的学生吧？
白家月：对。我是白家月，她是安妮。
王一雪：你们好，我叫王一雪。一飞给我打电话了，让我来`},{b:2},{t:`你们。
白家月、安妮：谢谢您。
王一雪：不客气。`}],answers:["姐姐","接"],tiles:{姐姐:{py:"jiějie",en:"older sister"},接:{py:"jiē",en:"to receive; to pick up"}}},grammar:{before:`白家月：请问，您是王一飞老师的姐姐吗？
王一雪：是的，`,after:`？
白家月：对。我是白家月，她是安妮。
王一雪：你们好，我叫王一雪。一飞给我打电话了，让我来接你们。
白家月、安妮：谢谢您。
王一雪：不客气。`,answer:"你们就是她的学生吧",tokens:["你们","就是","她","的","学生","吧"]},sentences:[{speaker:"白家月",text:"请问，您是王一飞老师的姐姐吗？",tokens:["请问","您","是","王","一","飞","老师","的","姐姐","吗"]},{speaker:"王一雪",text:"一飞给我打电话了，让我来接你们。",tokens:["一","飞","给","我","打电话","了","让","我","来","接","你们"]},{speaker:"王一雪",text:"是的，你们就是她的学生吧？",tokens:["是","的","你们","就是","她","的","学生","吧"]},{speaker:"白家月",text:"我是白家月，她是安妮。",tokens:["我","是","白家月","她","是","安妮"]},{speaker:"王一雪",text:"你们好，我叫王一雪。",tokens:["你们","好","我","叫","王","一","雪"]},{speaker:"白家月、安妮",text:"谢谢您。",tokens:["谢谢","您"]}],note:"语气助词“吧”（2）；“是……的”句；兼语句"},{n:2,title:"课文2",original:`王一雪：你们是第一次来北京吗？
白家月：是的，我们都是第一次来。
王一雪：你们是来学中文的吗？
安妮：不是，我们是来旅游的。
王一雪：我这几天都不忙，你们有事就找我。
白家月：好的，谢谢您。`,lines:[{name:"王一雪",zh:"你们是第一次来北京吗？",py:"Nǐmen shì dì-yī cì lái Běijīng ma?",en:"Is this your first time in Beijing?"},{name:"白家月",zh:"是的，我们都是第一次来。",py:"Shì de, wǒmen dōu shì dì-yī cì lái.",en:"Yes, it's the first time for both of us."},{name:"王一雪",zh:"你们是来学中文的吗？",py:"Nǐmen shì lái xué Zhōngwén de ma?",en:"Are you here to study Chinese?"},{name:"安妮",zh:"不是，我们是来旅游的。",py:"Bú shì, wǒmen shì lái lǚyóu de.",en:"No, we're here to travel."},{name:"王一雪",zh:"我这几天都不忙，你们有事就找我。",py:"Wǒ zhè jǐ tiān dōu bù máng, nǐmen yǒu shì jiù zhǎo wǒ.",en:"I'm free these days—come to me if you need anything."},{name:"白家月",zh:"好的，谢谢您。",py:"Hǎo de, xièxie nín.",en:"Okay, thank you."}],vocab:{seg:[{t:"王一雪：你们是"},{b:1},{t:`来北京吗？
白家月：是的，我们都是第一次来。
王一雪：你们是来学中文的吗？
安妮：不是，我们是来`},{b:2},{t:`的。
王一雪：我这几天都不忙，你们有事就找我。
白家月：好的，谢谢您。`}],answers:["第一次","旅游"],tiles:{第一次:{py:"dì-yī cì",en:"the first time"},旅游:{py:"lǚyóu",en:"to travel; make a tour"}}},grammar:{before:`王一雪：你们是第一次来北京吗？
白家月：是的，我们都是第一次来。
王一雪：`,after:`？
安妮：不是，我们是来旅游的。
王一雪：我这几天都不忙，你们有事就找我。
白家月：好的，谢谢您。`,answer:"你们是来学中文的吗",tokens:["你们","是","来","学","中文","的","吗"]},sentences:[{speaker:"王一雪",text:"你们是第一次来北京吗？",tokens:["你们","是","第一次","来","北京","吗"]},{speaker:"白家月",text:"是的，我们都是第一次来。",tokens:["是","的","我们","都","是","第一次","来"]},{speaker:"安妮",text:"不是，我们是来旅游的。",tokens:["不是","我们","是","来","旅游","的"]},{speaker:"王一雪",text:"你们是来学中文的吗？",tokens:["你们","是","来","学","中文","的","吗"]},{speaker:"王一雪",text:"我这几天都不忙，你们有事就找我。",tokens:["我","这","几天","都","不","忙","你们","有","事","就","找","我"]},{speaker:"白家月",text:"好的，谢谢您。",tokens:["好","的","谢谢","您"]}],note:"语气助词“吧”（2）；“是……的”句；兼语句"},{n:3,title:"课文3",original:`陈天中：喂，家月，你明天有时间吗？我想请你帮个忙。
白家月：不好意思，天中，我已经到北京了。
陈天中：你是什么时候到的？
白家月：我是今天早上到的。你有事可以叫李文帮忙，他还在学校呢。
陈天中：好的，那我给他打个电话。
白家月：好，再见！`,lines:[{name:"陈天中",zh:"喂，家月，你明天有时间吗？我想请你帮个忙。",py:"Wéi, Jiāyuè, nǐ míngtiān yǒu shíjiān ma? Wǒ xiǎng qǐng nǐ bāng ge máng.",en:"Hello, Jiayue, do you have time tomorrow? I'd like to ask you for a favor."},{name:"白家月",zh:"不好意思，天中，我已经到北京了。",py:"Bù hǎoyìsi, Tiānzhōng, wǒ yǐjīng dào Běijīng le.",en:"Sorry, Tianzhong, I've already arrived in Beijing."},{name:"陈天中",zh:"你是什么时候到的？",py:"Nǐ shì shénme shíhou dào de?",en:"When did you get there?"},{name:"白家月",zh:"我是今天早上到的。你有事可以叫李文帮忙，他还在学校呢。",py:"Wǒ shì jīntiān zǎoshang dào de. Nǐ yǒu shì kěyǐ jiào Lǐ Wén bāngmáng, tā hái zài xuéxiào ne.",en:"I got here this morning. If you need help, you can ask Li Wen—he's still at school."},{name:"陈天中",zh:"好的，那我给他打个电话。",py:"Hǎo de, nà wǒ gěi tā dǎ ge diànhuà.",en:"Okay, then I'll give him a call."},{name:"白家月",zh:"好，再见！",py:"Hǎo, zàijiàn!",en:"Okay, bye!"}],vocab:{seg:[{t:"陈天中：喂，家月，你明天有时间吗？我想请你"},{b:1},{t:`。
白家月：`},{b:2},{t:"，天中，我"},{b:3},{t:`到北京了。
陈天中：你是什么时候到的？
白家月：我是今天早上到的。你有事可以叫李文帮忙，他还在学校呢。
陈天中：好的，那我给他打个电话。
白家月：好，再见！`}],answers:["帮个忙","不好意思","已经"],tiles:{帮个忙:{py:"bāng ge máng",en:"to do (sb) a favor"},不好意思:{py:"bù hǎoyìsi",en:"to feel embarrassed; excuse me"},已经:{py:"yǐjīng",en:"already"}}},grammar:{before:"陈天中：喂，家月，你明天有时间吗？",after:`。
白家月：不好意思，天中，我已经到北京了。
陈天中：你是什么时候到的？
白家月：我是今天早上到的。你有事可以叫李文帮忙，他还在学校呢。
陈天中：好的，那我给他打个电话。
白家月：好，再见！`,answer:"我想请你帮个忙",tokens:["我","想","请","你","帮","个","忙"]},sentences:[{speaker:"陈天中",text:"我想请你帮个忙。",tokens:["我","想","请","你","帮个忙"]},{speaker:"白家月",text:"不好意思，天中，我已经到北京了。",tokens:["不好意思","天","中","我","已经","到","北京","了"]},{speaker:"陈天中",text:"喂，家月，你明天有时间吗？",tokens:["喂","家","月","你","明天","有时","间","吗"]},{speaker:"陈天中",text:"你是什么时候到的？",tokens:["你","是","什么","时候","到","的"]},{speaker:"白家月",text:"我是今天早上到的。",tokens:["我","是","今天","早上","到","的"]},{speaker:"白家月",text:"你有事可以叫李文帮忙，他还在学校呢。",tokens:["你","有","事","可以","叫","李文","帮忙","他","还","在","学校","呢"]},{speaker:"陈天中",text:"好的，那我给他打个电话。",tokens:["好","的","那","我","给","他","打","个","电话"]},{speaker:"白家月",text:"好，再见！",tokens:["好","再见"]}],note:"语气助词“吧”（2）；“是……的”句；兼语句"},{n:4,title:"课文4",original:"王老师，我们已经到北京了，是您姐姐来接的我们。她请我们吃了北京烤鸭，还给我们介绍了很多东西。我们的中文不太好，有时不太懂她的意思。",lines:[{name:"",zh:"王老师，我们已经到北京了，是您姐姐来接的我们。她请我们吃了北京烤鸭，还给我们介绍了很多东西。我们的中文不太好，有时不太懂她的意思。",py:"Wáng lǎoshī, wǒmen yǐjīng dào Běijīng le, shì nín jiějie lái jiē de wǒmen. Tā qǐng wǒmen chī le Běijīng kǎoyā, hái gěi wǒmen jièshào le hěn duō dōngxi. Wǒmen de Zhōngwén bú tài hǎo, yǒushí bú tài dǒng tā de yìsi.",en:"Teacher Wang, we've arrived in Beijing—your sister came to pick us up. She treated us to Peking duck and told us about many things. Our Chinese isn't very good, so sometimes we don't quite understand what she means."}],vocab:{seg:[{t:"王老师，我们已经到北京了，是您姐姐来接的我们。她请我们吃了北京烤鸭，还给我们"},{b:1},{t:"了很多东西。我们的中文不太好，"},{b:2},{t:"不太"},{b:3},{t:"她的"},{b:4},{t:"。"}],answers:["介绍","有时","懂","意思"],tiles:{介绍:{py:"jièshào",en:"to introduce"},有时:{py:"yǒushí",en:"sometimes"},懂:{py:"dǒng",en:"to understand; know"},意思:{py:"yìsi",en:"meaning; idea"}}},grammar:{before:"王老师，我们已经到北京了，",after:"。她请我们吃了北京烤鸭，还给我们介绍了很多东西。我们的中文不太好，有时不太懂她的意思。",answer:"是您姐姐来接的我们",tokens:["是","您","姐姐","来","接","的","我们"]},sentences:[{speaker:"",text:"她请我们吃了北京烤鸭，还给我们介绍了很多东西。",tokens:["她","请","我们","吃","了","北京","烤鸭","还给","我们","介绍","了","很多","东西"]},{speaker:"",text:"我们的中文不太好，有时不太懂她的意思。",tokens:["我们","的","中文","不太","好","有时","不太","懂","她","的","意思"]},{speaker:"",text:"王老师，我们已经到北京了，是您姐姐来接的我们。",tokens:["王老师","我们","已经","到","北京","了","是","您","姐姐","来","接","的","我们"]}],note:"语气助词“吧”（2）；“是……的”句；兼语句"}]},{num:2,name:"还是打车去北大吧",texts:[{n:1,title:"课文1",original:`白家月：请问，这儿有到北京大学的公交车吗？
服务员：有，但车站有点儿远。
白家月：这儿好打车吗？
服务员：好打车。
白家月：谢谢。安妮，我们还是打车去吧。
安妮：好，没问题。`,lines:[{name:"白家月",zh:"请问，这儿有到北京大学的公交车吗？",py:"Qǐngwèn, zhèr yǒu dào Běijīng Dàxué de gōngjiāochē ma?",en:"Excuse me, is there a bus to Peking University from here?"},{name:"服务员",zh:"有，但车站有点儿远。",py:"Yǒu, dàn chēzhàn yǒudiǎnr yuǎn.",en:"Yes, but the bus stop is a bit far."},{name:"白家月",zh:"这儿好打车吗？",py:"Zhèr hǎo dǎ chē ma?",en:"Is it easy to get a taxi here?"},{name:"服务员",zh:"好打车。",py:"Hǎo dǎ chē.",en:"Yes, easy."},{name:"白家月",zh:"谢谢。安妮，我们还是打车去吧。",py:"Xièxie. Ānnī, wǒmen háishi dǎ chē qù ba.",en:"Thanks. Annie, let's just take a taxi."},{name:"安妮",zh:"好，没问题。",py:"Hǎo, méi wèntí.",en:"Okay, no problem."}],vocab:{seg:[{t:"白家月：请问，这儿有到北京大学的"},{b:1},{t:`吗？
服务员：有，但`},{b:2},{t:`有点儿远。
白家月：这儿好`},{b:3},{t:`吗？
服务员：好打车。
白家月：谢谢。安妮，我们还是打车去吧。
安妮：好，没问题。`}],answers:["公交车","车站","打车"],tiles:{公交车:{py:"gōngjiāochē",en:"bus"},车站:{py:"chēzhàn",en:"station; bus stop"},打车:{py:"dǎchē",en:"to take/hail a taxi"}}},grammar:{before:`白家月：请问，这儿有到北京大学的公交车吗？
服务员：有，但车站有点儿远。
白家月：这儿好打车吗？
服务员：好打车。
白家月：谢谢。安妮，`,after:`。
安妮：好，没问题。`,answer:"我们还是打车去吧",tokens:["我们","还是","打车","去","吧"]},sentences:[{speaker:"白家月",text:"请问，这儿有到北京大学的公交车吗？",tokens:["请问","这儿","有","到","北京","大学","的","公交车","吗"]},{speaker:"服务员",text:"有，但车站有点儿远。",tokens:["有","但","车站","有点儿","远"]},{speaker:"白家月",text:"这儿好打车吗？",tokens:["这儿","好","打车","吗"]},{speaker:"服务员",text:"好打车。",tokens:["好","打车"]},{speaker:"白家月",text:"安妮，我们还是打车去吧。",tokens:["安妮","我们","还是","打车","去","吧"]},{speaker:"安妮",text:"好，没问题。",tokens:["好","没问题"]}],note:"固定格式“还是……吧”；用“多”表达概数；动词/动词性短语/主谓短语作定语"},{n:2,title:"课文2",original:`安妮：学校里人真多啊！
白家月：是啊，北京大学有四万多名学生呢！
安妮：你是怎么知道的？
白家月：是网上说的，网上还说北京大学有三千多名外国学生。
安妮：我也想来这儿学习。
白家月：那边就有一间教室，我们去看一下吧。`,lines:[{name:"安妮",zh:"学校里人真多啊！",py:"Xuéxiào li rén zhēn duō a!",en:"There are so many people on campus!"},{name:"白家月",zh:"是啊，北京大学有四万多名学生呢！",py:"Shì a, Běijīng Dàxué yǒu sì wàn duō míng xuésheng ne!",en:"Yeah, Peking University has over forty thousand students!"},{name:"安妮",zh:"你是怎么知道的？",py:"Nǐ shì zěnme zhīdào de?",en:"How do you know?"},{name:"白家月",zh:"是网上说的，网上还说北京大学有三千多名外国学生。",py:"Shì wǎng shàng shuō de, wǎng shàng hái shuō Běijīng Dàxué yǒu sānqiān duō míng wàiguó xuésheng.",en:"It said so online—it also said Peking University has over three thousand foreign students."},{name:"安妮",zh:"我也想来这儿学习。",py:"Wǒ yě xiǎng lái zhèr xuéxí.",en:"I'd like to study here too."},{name:"白家月",zh:"那边就有一间教室，我们去看一下吧。",py:"Nàbiān jiù yǒu yì jiān jiàoshì, wǒmen qù kàn yíxià ba.",en:"There's a classroom right over there—let's go take a look."}],vocab:{seg:[{t:`安妮：学校里人真多啊！
白家月：是啊，北京大学有四`},{b:1},{t:"多"},{b:2},{t:`学生呢！
安妮：你是怎么知道的？
白家月：是`},{b:3},{t:"说的，网上还说北京大学有三千多名"},{b:4},{t:`学生。
安妮：我也想来这儿学习。
白家月：那边就有一间`},{b:5},{t:"，我们去看一下吧。"}],answers:["万","名","网上","外国","教室"],tiles:{万:{py:"wàn",en:"ten thousand"},名:{py:"míng",en:"measure word for people; name"},网上:{py:"wǎngshàng",en:"online"},外国:{py:"wàiguó",en:"foreign country"},教室:{py:"jiàoshì",en:"classroom"}}},grammar:{before:`安妮：学校里人真多啊！
白家月：是啊，北京大学有`,after:`呢！
安妮：你是怎么知道的？
白家月：是网上说的，网上还说北京大学有三千多名外国学生。
安妮：我也想来这儿学习。
白家月：那边就有一间教室，我们去看一下吧。`,answer:"四万多名学生",tokens:["四万","多","名","学生"]},sentences:[{speaker:"白家月",text:"是啊，北京大学有四万多名学生呢！",tokens:["是","啊","北京","大学","有","四万","多","名","学生","呢"]},{speaker:"白家月",text:"那边就有一间教室，我们去看一下吧。",tokens:["那边","就","有","一","间","教室","我们","去","看","一下","吧"]},{speaker:"安妮",text:"学校里人真多啊！",tokens:["学校","里","人","真","多","啊"]},{speaker:"安妮",text:"你是怎么知道的？",tokens:["你","是","怎么","知道","的"]},{speaker:"安妮",text:"我也想来这儿学习。",tokens:["我","也","想","来","这儿","学习"]}],note:"固定格式“还是……吧”；用“多”表达概数；动词/动词性短语/主谓短语作定语"},{n:3,title:"课文3",original:`安妮：家月，你看，学校里有家电影院！
白家月：是啊，电影院还不小。
安妮：他们卖的电影票也很便宜。
白家月：天啊！有的还不到二十块钱。
安妮：那你想不想去看个电影？
白家月：还是别看电影了，北京大学本身就很好看！`,lines:[{name:"安妮",zh:"家月，你看，学校里有家电影院！",py:"Jiāyuè, nǐ kàn, xuéxiào li yǒu jiā diànyǐngyuàn!",en:"Jiayue, look—there's a cinema on campus!"},{name:"白家月",zh:"是啊，电影院还不小。",py:"Shì a, diànyǐngyuàn hái bù xiǎo.",en:"Yeah, and it's not small either."},{name:"安妮",zh:"他们卖的电影票也很便宜。",py:"Tāmen mài de diànyǐngpiào yě hěn piányi.",en:"The movie tickets they sell are cheap too."},{name:"白家月",zh:"天啊！有的还不到二十块钱。",py:"Tiān a! Yǒude hái bú dào èrshí kuài qián.",en:"Wow! Some are even under twenty yuan."},{name:"安妮",zh:"那你想不想去看个电影？",py:"Nà nǐ xiǎng bu xiǎng qù kàn ge diànyǐng?",en:"So do you want to go see a movie?"},{name:"白家月",zh:"还是别看电影了，北京大学本身就很好看！",py:"Háishi bié kàn diànyǐng le, Běijīng Dàxué běnshēn jiù hěn hǎokàn!",en:"Let's not watch a movie—Peking University itself is worth seeing!"}],vocab:{seg:[{t:"安妮：家月，你看，学校里有家"},{b:1},{t:`！
白家月：是啊，电影院还不小。
安妮：他们卖的`},{b:2},{t:"也很"},{b:3},{t:`。
白家月：天啊！有的还不到二十块钱。
安妮：那你想不想去看个电影？
白家月：还是别看电影了，北京大学`},{b:4},{t:"就很好看！"}],answers:["电影院","电影票","便宜","本身"],tiles:{电影院:{py:"diànyǐngyuàn",en:"cinema"},电影票:{py:"diànyǐngpiào",en:"movie ticket"},便宜:{py:"piányi",en:"cheap"},本身:{py:"běnshēn",en:"itself; oneself"}}},grammar:{before:`安妮：家月，你看，学校里有家电影院！
白家月：是啊，电影院还不小。
安妮：`,after:`也很便宜。
白家月：天啊！有的还不到二十块钱。
安妮：那你想不想去看个电影？
白家月：还是别看电影了，北京大学本身就很好看！`,answer:"他们卖的电影票",tokens:["他们","卖","的","电影票"]},sentences:[{speaker:"安妮",text:"家月，你看，学校里有家电影院！",tokens:["家","月","你","看","学校","里","有","家","电影院"]},{speaker:"白家月",text:"是啊，电影院还不小。",tokens:["是","啊","电影院","还","不","小"]},{speaker:"安妮",text:"他们卖的电影票也很便宜。",tokens:["他们","卖","的","电影票","也","很","便宜"]},{speaker:"白家月",text:"还是别看电影了，北京大学本身就很好看！",tokens:["还是","别","看","电影","了","北京","大学","本身","就","很","好看"]},{speaker:"白家月",text:"天啊！",tokens:["天","啊"]},{speaker:"白家月",text:"有的还不到二十块钱。",tokens:["有的","还","不到","二","十","块","钱"]},{speaker:"安妮",text:"那你想不想去看个电影？",tokens:["那","你","想","不","想","去","看","个","电影"]}],note:"固定格式“还是……吧”；用“多”表达概数；动词/动词性短语/主谓短语作定语"},{n:4,title:"课文4",original:"北京大学很大，有四万多名学生。学校很漂亮，里边还有几家电影院，电影票也不贵，我们有时间还想再过来看个电影。",lines:[{name:"",zh:"北京大学很大，有四万多名学生。学校很漂亮，里边还有几家电影院，电影票也不贵，我们有时间还想再过来看个电影。",py:"Běijīng Dàxué hěn dà, yǒu sì wàn duō míng xuésheng. Xuéxiào hěn piàoliang, lǐbian hái yǒu jǐ jiā diànyǐngyuàn, diànyǐngpiào yě bú guì, wǒmen yǒu shíjiān hái xiǎng zài guòlai kàn ge diànyǐng.",en:"Peking University is huge, with over forty thousand students. The campus is beautiful, and there are several cinemas inside with cheap tickets—when we have time, we'd like to come back and watch a movie."}],vocab:{seg:[{t:"北京大学很大，有四万多名学生。学校很"},{b:1},{t:"，里边还有几家"},{b:2},{t:"，"},{b:3},{t:"也不贵，我们有时间还想再过来看个电影。"}],answers:["漂亮","电影院","电影票"],tiles:{漂亮:{py:"piàoliang",en:"beautiful; pretty"},电影院:{py:"diànyǐngyuàn",en:"cinema"},电影票:{py:"diànyǐngpiào",en:"movie ticket"}}},grammar:{before:"北京大学很大，",after:"。学校很漂亮，里边还有几家电影院，电影票也不贵，我们有时间还想再过来看个电影。",answer:"有四万多名学生",tokens:["有","四万","多","名","学生"]},sentences:[{speaker:"",text:"北京大学很大，有四万多名学生。",tokens:["北京","大学","很","大","有","四万","多","名","学生"]}],note:"固定格式“还是……吧”；用“多”表达概数；动词/动词性短语/主谓短语作定语"}]},{num:3,name:"我想去西安旅游",texts:[{n:1,title:"课文1",original:`王一雪：今天回来这么晚啊！
刘明：工作太多了，下班的时候没做完。
王一雪：菜都做好了，过来吃饭吧。
刘明：我想休息一下，喝杯水。
王一雪：好的。`,lines:[{name:"王一雪",zh:"今天回来这么晚啊！",py:"Jīntiān huílai zhème wǎn a!",en:"You're home so late today!"},{name:"刘明",zh:"工作太多了，下班的时候没做完。",py:"Gōngzuò tài duō le, xiàbān de shíhou méi zuòwán.",en:"There was too much work—I didn't finish by the time I left."},{name:"王一雪",zh:"菜都做好了，过来吃饭吧。",py:"Cài dōu zuò hǎo le, guòlai chī fàn ba.",en:"The food's ready—come and eat."},{name:"刘明",zh:"我想休息一下，喝杯水。",py:"Wǒ xiǎng xiūxi yíxià, hē bēi shuǐ.",en:"I want to rest a bit and have a glass of water."},{name:"王一雪",zh:"好的。",py:"Hǎo de.",en:"Okay."}],vocab:{seg:[{t:"王一雪：今天"},{b:1},{t:`这么晚啊！
刘明：工作太多了，`},{b:2},{t:`的时候没做完。
王一雪：菜都做好了，过来吃饭吧。
刘明：我想`},{b:3},{t:`一下，喝杯水。
王一雪：好的。`}],answers:["回来","下班","休息"],tiles:{回来:{py:"huílai",en:"to come back; return"},下班:{py:"xiàbān",en:"to finish work"},休息:{py:"xiūxi",en:"to rest"}}},grammar:{before:`王一雪：今天回来这么晚啊！
刘明：工作太多了，下班的时候`,after:`。
王一雪：菜都做好了，过来吃饭吧。
刘明：我想休息一下，喝杯水。
王一雪：好的。`,answer:"没做完",tokens:["没","做","完"]},sentences:[{speaker:"王一雪",text:"今天回来这么晚啊！",tokens:["今天","回来","这么","晚","啊"]},{speaker:"刘明",text:"工作太多了，下班的时候没做完。",tokens:["工作","太","多","了","下班","的","时候","没","做","完"]},{speaker:"刘明",text:"我想休息一下，喝杯水。",tokens:["我","想","休息","一下","喝","杯","水"]},{speaker:"王一雪",text:"菜都做好了，过来吃饭吧。",tokens:["菜","都","做好","了","过来","吃饭","吧"]},{speaker:"王一雪",text:"好的。",tokens:["好","的"]}],note:"结果补语；动词重叠（1）；动词重叠（2）"},{n:2,title:"课文2",original:`刘明：我们找个时间去旅游，怎么样？
王一雪：好啊，我也很想一起出去玩儿。
刘明：你想去哪儿？
王一雪：我还没想好呢。
刘明：那你再想一想，你想好了，我来买票。`,lines:[{name:"刘明",zh:"我们找个时间去旅游，怎么样？",py:"Wǒmen zhǎo ge shíjiān qù lǚyóu, zěnmeyàng?",en:"How about we find a time to go traveling?"},{name:"王一雪",zh:"好啊，我也很想一起出去玩儿。",py:"Hǎo a, wǒ yě hěn xiǎng yìqǐ chūqu wánr.",en:"Sure, I'd love to go out together too."},{name:"刘明",zh:"你想去哪儿？",py:"Nǐ xiǎng qù nǎr?",en:"Where do you want to go?"},{name:"王一雪",zh:"我还没想好呢。",py:"Wǒ hái méi xiǎnghǎo ne.",en:"I haven't decided yet."},{name:"刘明",zh:"那你再想一想，你想好了，我来买票。",py:"Nà nǐ zài xiǎng yi xiǎng, nǐ xiǎnghǎo le, wǒ lái mǎi piào.",en:"Then think it over some more; once you've decided, I'll buy the tickets."}],vocab:{seg:[{t:"刘明：我们找个时间去"},{b:1},{t:`，怎么样？
王一雪：好啊，我也很想`},{b:2},{b:3},{t:`玩儿。
刘明：你想去哪儿？
王一雪：我还没想好呢。
刘明：那你再想一想，你想好了，我来买票。`}],answers:["旅游","一起","出去"],tiles:{旅游:{py:"lǚyóu",en:"to travel; make a tour"},一起:{py:"yìqǐ",en:"together"},出去:{py:"chūqù",en:"to go out"}}},grammar:{before:`刘明：我们找个时间去旅游，怎么样？
王一雪：好啊，我也很想一起出去玩儿。
刘明：你想去哪儿？
王一雪：我还没想好呢。
刘明：那你`,after:"，你想好了，我来买票。",answer:"再想一想",tokens:["再","想一想"]},sentences:[{speaker:"刘明",text:"我们找个时间去旅游，怎么样？",tokens:["我们","找","个","时间","去","旅游","怎么样"]},{speaker:"王一雪",text:"好啊，我也很想一起出去玩儿。",tokens:["好","啊","我","也","很","想","一起","出去","玩儿"]},{speaker:"刘明",text:"你想去哪儿？",tokens:["你","想","去","哪儿"]},{speaker:"王一雪",text:"我还没想好呢。",tokens:["我","还","没","想好","呢"]},{speaker:"刘明",text:"那你再想一想，你想好了，我来买票。",tokens:["那","你","再","想一想","你","想好","了","我","来","买","票"]}],note:"结果补语；动词重叠（1）；动词重叠（2）"},{n:3,title:"课文3",original:`刘明：吃个苹果吧，我都洗好了。
王一雪：好的。
刘明：就在桌子上，你自己拿。
王一雪：我去洗洗手。对了，我们去西安旅游，怎么样？
刘明：为什么想去西安？
王一雪：我看了看网上的介绍，这个时候去西安很不错！`,lines:[{name:"刘明",zh:"吃个苹果吧，我都洗好了。",py:"Chī ge píngguǒ ba, wǒ dōu xǐ hǎo le.",en:"Have an apple—I've already washed them."},{name:"王一雪",zh:"好的。",py:"Hǎo de.",en:"Okay."},{name:"刘明",zh:"就在桌子上，你自己拿。",py:"Jiù zài zhuōzi shàng, nǐ zìjǐ ná.",en:"They're on the table—help yourself."},{name:"王一雪",zh:"我去洗洗手。对了，我们去西安旅游，怎么样？",py:"Wǒ qù xǐxi shǒu. Duì le, wǒmen qù Xī'ān lǚyóu, zěnmeyàng?",en:"I'll go wash my hands. By the way, how about we travel to Xi'an?"},{name:"刘明",zh:"为什么想去西安？",py:"Wèishénme xiǎng qù Xī'ān?",en:"Why do you want to go to Xi'an?"},{name:"王一雪",zh:"我看了看网上的介绍，这个时候去西安很不错！",py:"Wǒ kàn le kàn wǎng shàng de jièshào, zhège shíhou qù Xī'ān hěn búcuò!",en:"I looked at some descriptions online—this is a great time to visit Xi'an!"}],vocab:{seg:[{t:"刘明：吃个苹果吧，我都"},{b:1},{t:`好了。
王一雪：好的。
刘明：就在桌子上，你`},{b:2},{b:3},{t:`。
王一雪：我去洗洗手。对了，我们去西安旅游，怎么样？
刘明：为什么想去西安？
王一雪：我看了看网上的`},{b:4},{t:"，这个时候去西安很"},{b:5},{t:"！"}],answers:["洗","自己","拿","介绍","不错"],tiles:{洗:{py:"xǐ",en:"to wash"},自己:{py:"zìjǐ",en:"oneself; self"},拿:{py:"ná",en:"to take; to hold"},介绍:{py:"jièshào",en:"to introduce"},不错:{py:"búcuò",en:"not bad; pretty good"}}},grammar:{before:`刘明：吃个苹果吧，我都洗好了。
王一雪：好的。
刘明：就在桌子上，你自己拿。
王一雪：`,after:`。对了，我们去西安旅游，怎么样？
刘明：为什么想去西安？
王一雪：我看了看网上的介绍，这个时候去西安很不错！`,answer:"我去洗洗手",tokens:["我","去","洗洗手"]},sentences:[{speaker:"刘明",text:"吃个苹果吧，我都洗好了。",tokens:["吃","个","苹果","吧","我","都","洗","好","了"]},{speaker:"刘明",text:"就在桌子上，你自己拿。",tokens:["就","在","桌子","上","你","自己","拿"]},{speaker:"王一雪",text:"我去洗洗手。",tokens:["我","去","洗洗手"]},{speaker:"王一雪",text:"我看了看网上的介绍，这个时候去西安很不错！",tokens:["我","看","了","看","网上","的","介绍","这个","时候","去","西","安","很","不错"]},{speaker:"王一雪",text:"好的。",tokens:["好","的"]},{speaker:"王一雪",text:"对了，我们去西安旅游，怎么样？",tokens:["对了","我们","去","西","安","旅游","怎么样"]},{speaker:"刘明",text:"为什么想去西安？",tokens:["为什么","想","去","西","安"]}],note:"结果补语；动词重叠（1）；动词重叠（2）"},{n:4,title:"课文4",original:"早上，刘明开车送孩子去学校，送完孩子回家后，医院就来电话了，让他回去上班。我觉得他这个月每天都很累，真想让他休息休息。",lines:[{name:"",zh:"早上，刘明开车送孩子去学校，送完孩子回家后，医院就来电话了，让他回去上班。我觉得他这个月每天都很累，真想让他休息休息。",py:"Zǎoshang, Liú Míng kāichē sòng háizi qù xuéxiào, sòng wán háizi huí jiā hòu, yīyuàn jiù lái diànhuà le, ràng tā huíqu shàngbān. Wǒ juéde tā zhège yuè měi tiān dōu hěn lèi, zhēn xiǎng ràng tā xiūxi xiūxi.",en:"In the morning, Liu Ming drove the kids to school; after dropping them off and getting home, the hospital called and asked him to go back to work. I think he's been tired every day this month—I really wish he could get some rest."}],vocab:{seg:[{t:"早上，刘明"},{b:1},{t:"送孩子去学校，送完孩子回家后，"},{b:2},{t:"就来电话了，让他回去上班。我觉得他这个月每天都很"},{b:3},{t:"，真想让他休息休息。"}],answers:["开车","医院","累"],tiles:{开车:{py:"kāichē",en:"to drive"},医院:{py:"yīyuàn",en:"hospital"},累:{py:"lèi",en:"tired; weary"}}},grammar:{before:"早上，刘明开车送孩子去学校，送完孩子回家后，医院就来电话了，让他回去上班。我觉得他这个月每天都很累，真想让他",after:"。",answer:"休息休息",tokens:["休息","休息"]},sentences:[{speaker:"",text:"我觉得他这个月每天都很累，真想让他休息休息。",tokens:["我","觉得","他","这个","月","每天","都","很","累","真","想","让","他","休息","休息"]}],note:"结果补语；动词重叠（1）；动词重叠（2）"}]},{num:4,name:"你穿红色的很好看",texts:[{n:1,title:"课文1",original:`刘小雪：妈妈，我们来过这家商场吗？
王一雪：没来过，这是新开的。
刘小雪：我们进去看看吧。
王一雪：好啊！你想买点儿什么？
刘小雪：我想买条裤子。
王一雪：没问题。`,lines:[{name:"刘小雪",zh:"妈妈，我们来过这家商场吗？",py:"Māma, wǒmen láiguo zhè jiā shāngchǎng ma?",en:"Mom, have we been to this mall before?"},{name:"王一雪",zh:"没来过，这是新开的。",py:"Méi láiguo, zhè shì xīn kāi de.",en:"No, it's newly opened."},{name:"刘小雪",zh:"我们进去看看吧。",py:"Wǒmen jìnqu kànkan ba.",en:"Let's go in and take a look."},{name:"王一雪",zh:"好啊！你想买点儿什么？",py:"Hǎo a! Nǐ xiǎng mǎi diǎnr shénme?",en:"Sure! What do you want to buy?"},{name:"刘小雪",zh:"我想买条裤子。",py:"Wǒ xiǎng mǎi tiáo kùzi.",en:"I want to buy a pair of pants."},{name:"王一雪",zh:"没问题。",py:"Méi wèntí.",en:"No problem."}],vocab:{seg:[{t:"刘小雪：妈妈，我们来过这家"},{b:1},{t:`吗？
王一雪：没来过，这是新开的。
刘小雪：我们`},{b:2},{t:`看看吧。
王一雪：好啊！你想买点儿什么？
刘小雪：我想买条`},{b:3},{t:`。
王一雪：没问题。`}],answers:["商场","进去","裤子"],tiles:{商场:{py:"shāngchǎng",en:"shopping mall; department store"},进去:{py:"jìnqù",en:"to go in"},裤子:{py:"kùzi",en:"pants; trousers"}}},grammar:{before:"刘小雪：妈妈，我们",after:`？
王一雪：没来过，这是新开的。
刘小雪：我们进去看看吧。
王一雪：好啊！你想买点儿什么？
刘小雪：我想买条裤子。
王一雪：没问题。`,answer:"来过这家商场吗",tokens:["来过","这家","商场","吗"]},sentences:[{speaker:"刘小雪",text:"妈妈，我们来过这家商场吗？",tokens:["妈妈","我们","来过","这家","商场","吗"]},{speaker:"刘小雪",text:"我们进去看看吧。",tokens:["我们","进去","看看","吧"]},{speaker:"刘小雪",text:"我想买条裤子。",tokens:["我","想","买","条","裤子"]},{speaker:"王一雪",text:"没来过，这是新开的。",tokens:["没","来过","这","是","新","开","的"]},{speaker:"王一雪",text:"好啊！",tokens:["好","啊"]},{speaker:"王一雪",text:"你想买点儿什么？",tokens:["你","想","买","点儿","什么"]}],note:"动态助词“过”；因果复句“因为……，所以……”；“的”字短语"},{n:2,title:"课文2",original:`刘小雪：妈妈，我想买这条白色的裤子。
王一雪：你有很多白色的衣服，为什么还买白色的？
刘小雪：因为我喜欢白色的呀！
王一雪：我觉得这条白色的不太好看，你试试那条红色的吧。
刘小雪：我没穿过红色的裤子，您觉得我穿红色的好看吗？
王一雪：就是因为没穿过，所以要试试啊！`,lines:[{name:"刘小雪",zh:"妈妈，我想买这条白色的裤子。",py:"Māma, wǒ xiǎng mǎi zhè tiáo báisè de kùzi.",en:"Mom, I want to buy these white pants."},{name:"王一雪",zh:"你有很多白色的衣服，为什么还买白色的？",py:"Nǐ yǒu hěn duō báisè de yīfu, wèishénme hái mǎi báisè de?",en:"You have lots of white clothes—why buy more white ones?"},{name:"刘小雪",zh:"因为我喜欢白色的呀！",py:"Yīnwèi wǒ xǐhuan báisè de ya!",en:"Because I like white!"},{name:"王一雪",zh:"我觉得这条白色的不太好看，你试试那条红色的吧。",py:"Wǒ juéde zhè tiáo báisè de bú tài hǎokàn, nǐ shìshi nà tiáo hóngsè de ba.",en:"I don't think these white ones look that nice—try the red ones."},{name:"刘小雪",zh:"我没穿过红色的裤子，您觉得我穿红色的好看吗？",py:"Wǒ méi chuānguo hóngsè de kùzi, nín juéde wǒ chuān hóngsè de hǎokàn ma?",en:"I've never worn red pants—do you think I'd look good in red?"},{name:"王一雪",zh:"就是因为没穿过，所以要试试啊！",py:"Jiù shì yīnwèi méi chuānguo, suǒyǐ yào shìshi a!",en:"It's precisely because you haven't worn them that you should try!"}],vocab:{seg:[{t:"刘小雪：妈妈，我想买这条"},{b:1},{t:`的裤子。
王一雪：你有很多白色的衣服，为什么还买白色的？
刘小雪：`},{b:2},{t:`我喜欢白色的呀！
王一雪：我觉得这条白色的不太好看，你`},{b:3},{t:"那条"},{b:4},{t:`的吧。
刘小雪：我没穿过红色的裤子，您觉得我穿红色的好看吗？
王一雪：就是因为没穿过，所以要试试啊！`}],answers:["白色","因为","试试","红色"],tiles:{白色:{py:"báisè",en:"white"},因为:{py:"yīnwèi",en:"because"},试试:{py:"shìshi",en:"to try (out)"},红色:{py:"hóngsè",en:"red"}}},grammar:{before:`刘小雪：妈妈，我想买这条白色的裤子。
王一雪：你有很多白色的衣服，为什么还买白色的？
刘小雪：因为我喜欢白色的呀！
王一雪：我觉得这条白色的不太好看，你试试那条红色的吧。
刘小雪：我没穿过红色的裤子，您觉得我穿红色的好看吗？
王一雪：`,after:"！",answer:"就是因为没穿过，所以要试试啊",tokens:["就是","因为","没","穿过","所以","要","试试","啊"]},sentences:[{speaker:"刘小雪",text:"妈妈，我想买这条白色的裤子。",tokens:["妈妈","我","想","买","这","条","白色","的","裤子"]},{speaker:"王一雪",text:"你有很多白色的衣服，为什么还买白色的？",tokens:["你","有","很多","白色","的","衣服","为什么","还","买","白色","的"]},{speaker:"刘小雪",text:"因为我喜欢白色的呀！",tokens:["因为","我","喜欢","白色","的","呀"]},{speaker:"王一雪",text:"我觉得这条白色的不太好看，你试试那条红色的吧。",tokens:["我","觉得","这","条","白色","的","不太","好看","你","试试","那","条","红色","的","吧"]},{speaker:"刘小雪",text:"我没穿过红色的裤子，您觉得我穿红色的好看吗？",tokens:["我","没","穿过","红色","的","裤子","您","觉得","我","穿","红色","的","好看","吗"]},{speaker:"王一雪",text:"就是因为没穿过，所以要试试啊！",tokens:["就是","因为","没","穿过","所以","要","试试","啊"]}],note:"动态助词“过”；因果复句“因为……，所以……”；“的”字短语"},{n:3,title:"课文3",original:`刘小雪：妈妈，我想买个新书包。
王一雪：好，那边有卖书包的，我们过去看看吧。
刘小雪：这么多漂亮的书包！
王一雪：红色的、绿色的、黑色的，你想买哪个？
刘小雪：绿色的吧。
王一雪：不错，我也觉得绿色的更好看。`,lines:[{name:"刘小雪",zh:"妈妈，我想买个新书包。",py:"Māma, wǒ xiǎng mǎi ge xīn shūbāo.",en:"Mom, I want to buy a new schoolbag."},{name:"王一雪",zh:"好，那边有卖书包的，我们过去看看吧。",py:"Hǎo, nàbiān yǒu mài shūbāo de, wǒmen guòqu kànkan ba.",en:"Okay, they sell schoolbags over there—let's go take a look."},{name:"刘小雪",zh:"这么多漂亮的书包！",py:"Zhème duō piàoliang de shūbāo!",en:"So many pretty schoolbags!"},{name:"王一雪",zh:"红色的、绿色的、黑色的，你想买哪个？",py:"Hóngsè de, lǜsè de, hēisè de, nǐ xiǎng mǎi nǎge?",en:"Red, green, black—which one do you want?"},{name:"刘小雪",zh:"绿色的吧。",py:"Lǜsè de ba.",en:"The green one."},{name:"王一雪",zh:"不错，我也觉得绿色的更好看。",py:"Búcuò, wǒ yě juéde lǜsè de gèng hǎokàn.",en:"Nice—I also think the green one looks better."}],vocab:{seg:[{t:"刘小雪：妈妈，我想买个新"},{b:1},{t:`。
王一雪：好，那边有卖书包的，我们`},{b:2},{t:`看看吧。
刘小雪：这么多漂亮的书包！
王一雪：红色的、`},{b:3},{t:`的、黑色的，你想买哪个？
刘小雪：绿色的吧。
王一雪：不错，我也觉得绿色的`},{b:4},{t:"好看。"}],answers:["书包","过去","绿色","更"],tiles:{书包:{py:"shūbāo",en:"schoolbag"},过去:{py:"guòqù",en:"past; formerly; to go over"},绿色:{py:"lǜsè",en:"green"},更:{py:"gèng",en:"more; even more"}}},grammar:{before:`刘小雪：妈妈，我想买个新书包。
王一雪：好，那边有`,after:`，我们过去看看吧。
刘小雪：这么多漂亮的书包！
王一雪：红色的、绿色的、黑色的，你想买哪个？
刘小雪：绿色的吧。
王一雪：不错，我也觉得绿色的更好看。`,answer:"卖书包的",tokens:["卖","书包","的"]},sentences:[{speaker:"刘小雪",text:"妈妈，我想买个新书包。",tokens:["妈妈","我","想","买","个","新","书包"]},{speaker:"王一雪",text:"好，那边有卖书包的，我们过去看看吧。",tokens:["好","那边","有","卖","书包","的","我们","过去","看看","吧"]},{speaker:"刘小雪",text:"这么多漂亮的书包！",tokens:["这么","多","漂亮","的","书包"]},{speaker:"王一雪",text:"红色的、绿色的、黑色的，你想买哪个？",tokens:["红色","的","绿色","的","黑色","的","你","想","买","哪个"]},{speaker:"刘小雪",text:"绿色的吧。",tokens:["绿色","的","吧"]},{speaker:"王一雪",text:"不错，我也觉得绿色的更好看。",tokens:["不错","我","也","觉得","绿色","的","更","好看"]}],note:"动态助词“过”；因果复句“因为……，所以……”；“的”字短语"},{n:4,title:"课文4",original:"我和妈妈去了一家商场。因为是新开的，所以这几天东西很便宜。商场里的衣服颜色很多。我没穿过红色的裤子，妈妈让我试了试，我觉得我穿红色的也很好看。",lines:[{name:"",zh:"我和妈妈去了一家商场。因为是新开的，所以这几天东西很便宜。商场里的衣服颜色很多。我没穿过红色的裤子，妈妈让我试了试，我觉得我穿红色的也很好看。",py:"Wǒ hé māma qù le yì jiā shāngchǎng. Yīnwèi shì xīn kāi de, suǒyǐ zhè jǐ tiān dōngxi hěn piányi. Shāngchǎng li de yīfu yánsè hěn duō. Wǒ méi chuānguo hóngsè de kùzi, māma ràng wǒ shì le shì, wǒ juéde wǒ chuān hóngsè de yě hěn hǎokàn.",en:"Mom and I went to a mall. Because it just opened, things are cheap these days. There are many colors of clothes in the mall. I'd never worn red pants, but Mom had me try some, and I think I look good in red too."}],vocab:{seg:[{t:"我和妈妈去了一家"},{b:1},{t:"。因为是新开的，所以这几天东西很"},{b:2},{t:"。商场里的衣服"},{b:3},{t:"很多。我没穿过红色的裤子，妈妈让我试了试，我觉得我穿红色的也很好看。"}],answers:["商场","便宜","颜色"],tiles:{商场:{py:"shāngchǎng",en:"shopping mall; department store"},便宜:{py:"piányi",en:"cheap"},颜色:{py:"yánsè",en:"color"}}},grammar:{before:"我和妈妈去了一家商场。因为是新开的，所以这几天东西很便宜。商场里的衣服颜色很多。我",after:"，妈妈让我试了试，我觉得我穿红色的也很好看。",answer:"没穿过红色的裤子",tokens:["没","穿过","红色","的","裤子"]},sentences:[{speaker:"",text:"我和妈妈去了一家商场。",tokens:["我","和","妈妈","去","了","一家","商场"]},{speaker:"",text:"因为是新开的，所以这几天东西很便宜。",tokens:["因为","是","新","开","的","所以","这","几天","东西","很","便宜"]},{speaker:"",text:"商场里的衣服颜色很多。",tokens:["商场","里","的","衣服","颜色","很多"]}],note:"动态助词“过”；因果复句“因为……，所以……”；“的”字短语"}]},{num:5,name:"第一次去中国朋友家",texts:[{n:1,title:"课文1",original:`安妮：家月，快下来吧，第一次去中国朋友家，别晚了。
白家月：还有时间，你上来吧。
安妮：我不上去了，就在下面等你。
白家月：那我一会儿就下来。
安妮：你快点儿吧。
白家月：没事，一雪姐说11点前到就可以。`,lines:[{name:"安妮",zh:"家月，快下来吧，第一次去中国朋友家，别晚了。",py:"Jiāyuè, kuài xiàlai ba, dì-yī cì qù Zhōngguó péngyou jiā, bié wǎn le.",en:"Jiayue, come down quick—it's our first time visiting a Chinese friend's home, let's not be late."},{name:"白家月",zh:"还有时间，你上来吧。",py:"Hái yǒu shíjiān, nǐ shànglai ba.",en:"There's still time—come on up."},{name:"安妮",zh:"我不上去了，就在下面等你。",py:"Wǒ bú shàngqu le, jiù zài xiàmiàn děng nǐ.",en:"I won't come up—I'll wait for you downstairs."},{name:"白家月",zh:"那我一会儿就下来。",py:"Nà wǒ yíhuìr jiù xiàlai.",en:"Then I'll be down in a moment."},{name:"安妮",zh:"你快点儿吧。",py:"Nǐ kuài diǎnr ba.",en:"Hurry up."},{name:"白家月",zh:"没事，一雪姐说11点前到就可以。",py:"Méi shì, Yīxuě jiě shuō shíyī diǎn qián dào jiù kěyǐ.",en:"It's fine—Sister Yixue said it's okay as long as we arrive before eleven."}],vocab:{seg:[{t:"安妮：家月，快"},{b:1},{t:`吧，第一次去中国朋友家，别晚了。
白家月：还有时间，你`},{b:2},{t:`吧。
安妮：我不上去了，就在`},{b:3},{b:4},{t:`你。
白家月：那我一会儿就下来。
安妮：你快点儿吧。
白家月：没事，一雪姐说11点前到就可以。`}],answers:["下来","上来","下面","等"],tiles:{下来:{py:"xiàlái",en:"to come down"},上来:{py:"shànglái",en:"to come up"},下面:{py:"xiàmiàn",en:"below; under"},等:{py:"děng",en:"to wait for"}}},grammar:{before:"安妮：家月，",after:`，第一次去中国朋友家，别晚了。
白家月：还有时间，你上来吧。
安妮：我不上去了，就在下面等你。
白家月：那我一会儿就下来。
安妮：你快点儿吧。
白家月：没事，一雪姐说11点前到就可以。`,answer:"快下来吧",tokens:["快","下来","吧"]},sentences:[{speaker:"安妮",text:"家月，快下来吧，第一次去中国朋友家，别晚了。",tokens:["家","月","快","下来","吧","第一","次","去","中国","朋友","家","别","晚","了"]},{speaker:"白家月",text:"还有时间，你上来吧。",tokens:["还有","时间","你","上来","吧"]},{speaker:"安妮",text:"我不上去了，就在下面等你。",tokens:["我","不","上去","了","就","在","下面","等","你"]},{speaker:"白家月",text:"那我一会儿就下来。",tokens:["那","我","一会儿","就","下来"]},{speaker:"安妮",text:"你快点儿吧。",tokens:["你","快","点儿","吧"]},{speaker:"白家月",text:"没事，一雪姐说11点前到就可以。",tokens:["没事","一","雪","姐","说","1","1","点","前","到","就","可以"]}],note:"简单趋向补语（1）；简单趋向补语（2）；固定格式“都……了”"},{n:2,title:"课文2",original:`王一雪：家月、安妮，快进来！我给你们介绍一下，这是孩子们的爷爷、奶奶。
爷爷、奶奶：你们好！
白家月、安妮：爷爷、奶奶好！
白家月：这是送你们的礼物。
爷爷、奶奶：你们太客气了，还拿这么多礼物来！
白家月：一雪姐，这是给孩子们准备的礼物。
王一雪：谢谢！你们别客气，快坐吧！`,lines:[{name:"王一雪",zh:"家月、安妮，快进来！我给你们介绍一下，这是孩子们的爷爷、奶奶。",py:"Jiāyuè, Ānnī, kuài jìnlai! Wǒ gěi nǐmen jièshào yíxià, zhè shì háizimen de yéye, nǎinai.",en:"Jiayue, Annie, come in! Let me introduce you—these are the children's grandpa and grandma."},{name:"爷爷、奶奶",zh:"你们好！",py:"Nǐmen hǎo!",en:"Hello, everyone!"},{name:"白家月、安妮",zh:"爷爷、奶奶好！",py:"Yéye, nǎinai hǎo!",en:"Hello, Grandpa and Grandma!"},{name:"白家月",zh:"这是送你们的礼物。",py:"Zhè shì sòng nǐmen de lǐwù.",en:"This is a gift for you."},{name:"爷爷、奶奶",zh:"你们太客气了，还拿这么多礼物来！",py:"Nǐmen tài kèqi le, hái ná zhème duō lǐwù lái!",en:"You're too kind—bringing so many gifts!"},{name:"白家月",zh:"一雪姐，这是给孩子们准备的礼物。",py:"Yīxuě jiě, zhè shì gěi háizimen zhǔnbèi de lǐwù.",en:"Sister Yixue, these are gifts for the children."},{name:"王一雪",zh:"谢谢！你们别客气，快坐吧！",py:"Xièxie! Nǐmen bié kèqi, kuài zuò ba!",en:"Thanks! Make yourselves at home—have a seat!"}],vocab:{seg:[{t:"王一雪：家月、安妮，快"},{b:1},{t:"！我给你们"},{b:2},{t:`一下，这是孩子们的爷爷、奶奶。
爷爷、奶奶：你们好！
白家月、安妮：爷爷、奶奶好！
白家月：这是送你们的`},{b:3},{t:`。
爷爷、奶奶：你们太客气了，还拿这么多礼物来！
白家月：一雪姐，这是给孩子们`},{b:4},{t:`的礼物。
王一雪：谢谢！你们别客气，快坐吧！`}],answers:["进来","介绍","礼物","准备"],tiles:{进来:{py:"jìnlái",en:"to come in"},介绍:{py:"jièshào",en:"to introduce"},礼物:{py:"lǐwù",en:"gift; present"},准备:{py:"zhǔnbèi",en:"to prepare"}}},grammar:{before:"王一雪：家月、安妮，",after:`！我给你们介绍一下，这是孩子们的爷爷、奶奶。
爷爷、奶奶：你们好！
白家月、安妮：爷爷、奶奶好！
白家月：这是送你们的礼物。
爷爷、奶奶：你们太客气了，还拿这么多礼物来！
白家月：一雪姐，这是给孩子们准备的礼物。
王一雪：谢谢！你们别客气，快坐吧！`,answer:"快进来",tokens:["快","进来"]},sentences:[{speaker:"王一雪",text:"家月、安妮，快进来！",tokens:["家","月","安妮","快","进来"]},{speaker:"王一雪",text:"我给你们介绍一下，这是孩子们的爷爷、奶奶。",tokens:["我","给","你们","介绍","一下","这","是","孩子","们","的","爷爷","奶奶"]},{speaker:"白家月",text:"这是送你们的礼物。",tokens:["这","是","送","你们","的","礼物"]},{speaker:"爷爷、奶奶",text:"你们太客气了，还拿这么多礼物来！",tokens:["你们","太","客气","了","还","拿","这么","多","礼物","来"]},{speaker:"白家月",text:"一雪姐，这是给孩子们准备的礼物。",tokens:["一","雪","姐","这","是","给","孩子","们","准备","的","礼物"]},{speaker:"爷爷、奶奶",text:"你们好！",tokens:["你们","好"]},{speaker:"白家月、安妮",text:"爷爷、奶奶好！",tokens:["爷爷","奶奶","好"]},{speaker:"王一雪",text:"你们别客气，快坐吧！",tokens:["你们","别","客气","快","坐","吧"]}],note:"简单趋向补语（1）；简单趋向补语（2）；固定格式“都……了”"},{n:3,title:"课文3",original:`王一雪：都12点了，我们吃饭吧。
白家月：这么多好吃的，您太会做菜了！
王一雪：都是我自己做的，你们多吃点儿。
白家月：奶茶也很好喝，是您自己做的吗？
王一雪：不是，奶茶是爷爷买的。
白家月：在哪儿买的？我还没喝过这么好喝的奶茶。
王一雪：就在前边的商场，吃完饭你们可以跟我去看看。`,lines:[{name:"王一雪",zh:"都12点了，我们吃饭吧。",py:"Dōu shí'èr diǎn le, wǒmen chī fàn ba.",en:"It's already twelve—let's eat."},{name:"白家月",zh:"这么多好吃的，您太会做菜了！",py:"Zhème duō hǎochī de, nín tài huì zuò cài le!",en:"So much delicious food—you're a wonderful cook!"},{name:"王一雪",zh:"都是我自己做的，你们多吃点儿。",py:"Dōu shì wǒ zìjǐ zuò de, nǐmen duō chī diǎnr.",en:"I made it all myself—help yourselves to more."},{name:"白家月",zh:"奶茶也很好喝，是您自己做的吗？",py:"Nǎichá yě hěn hǎohē, shì nín zìjǐ zuò de ma?",en:"The milk tea is delicious too—did you make it yourself?"},{name:"王一雪",zh:"不是，奶茶是爷爷买的。",py:"Bú shì, nǎichá shì yéye mǎi de.",en:"No, Grandpa bought the milk tea."},{name:"白家月",zh:"在哪儿买的？我还没喝过这么好喝的奶茶。",py:"Zài nǎr mǎi de? Wǒ hái méi hēguo zhème hǎohē de nǎichá.",en:"Where did he buy it? I've never had such good milk tea."},{name:"王一雪",zh:"就在前边的商场，吃完饭你们可以跟我去看看。",py:"Jiù zài qiánbian de shāngchǎng, chī wán fàn nǐmen kěyǐ gēn wǒ qù kànkan.",en:"At the mall up ahead—after the meal you can come with me to have a look."}],vocab:{seg:[{t:`王一雪：都12点了，我们吃饭吧。
白家月：这么多好吃的，您太会做菜了！
王一雪：都是我自己做的，你们多吃点儿。
白家月：`},{b:1},{t:"也很"},{b:2},{t:`，是您自己做的吗？
王一雪：不是，奶茶是爷爷买的。
白家月：在哪儿买的？我还没喝过这么好喝的奶茶。
王一雪：就在前边的`},{b:3},{t:"，吃完饭你们可以跟我去看看。"}],answers:["奶茶","好喝","商场"],tiles:{奶茶:{py:"nǎichá",en:"bubble tea"},好喝:{py:"hǎohē",en:"tasty; good to drink"},商场:{py:"shāngchǎng",en:"shopping mall; department store"}}},grammar:{before:"王一雪：",after:`，我们吃饭吧。
白家月：这么多好吃的，您太会做菜了！
王一雪：都是我自己做的，你们多吃点儿。
白家月：奶茶也很好喝，是您自己做的吗？
王一雪：不是，奶茶是爷爷买的。
白家月：在哪儿买的？我还没喝过这么好喝的奶茶。
王一雪：就在前边的商场，吃完饭你们可以跟我去看看。`,answer:"都12点了",tokens:["都","12","点","了"]},sentences:[{speaker:"白家月",text:"奶茶也很好喝，是您自己做的吗？",tokens:["奶茶","也","很","好喝","是","您","自己","做","的","吗"]},{speaker:"王一雪",text:"不是，奶茶是爷爷买的。",tokens:["不是","奶茶","是","爷爷","买","的"]},{speaker:"白家月",text:"我还没喝过这么好喝的奶茶。",tokens:["我","还","没","喝","过","这么","好喝","的","奶茶"]},{speaker:"王一雪",text:"就在前边的商场，吃完饭你们可以跟我去看看。",tokens:["就","在","前边","的","商场","吃","完","饭","你们","可以","跟","我","去","看看"]},{speaker:"王一雪",text:"都12点了，我们吃饭吧。",tokens:["都","12","点","了","我们","吃饭","吧"]},{speaker:"白家月",text:"这么多好吃的，您太会做菜了！",tokens:["这么","多","好吃","的","您","太","会","做","菜","了"]},{speaker:"王一雪",text:"都是我自己做的，你们多吃点儿。",tokens:["都","是","我","自己","做","的","你们","多","吃","点儿"]},{speaker:"白家月",text:"在哪儿买的？",tokens:["在","哪儿","买","的"]}],note:"简单趋向补语（1）；简单趋向补语（2）；固定格式“都……了”"},{n:4,title:"课文4",original:"回国前一天，我们去一雪姐家了。到她家的时候，饭菜都做好了。刘爷爷还准备了奶茶。因为吃了太多东西，我们吃完饭是走回酒店的。",lines:[{name:"",zh:"回国前一天，我们去一雪姐家了。到她家的时候，饭菜都做好了。刘爷爷还准备了奶茶。因为吃了太多东西，我们吃完饭是走回酒店的。",py:"Huí guó qián yì tiān, wǒmen qù Yīxuě jiě jiā le. Dào tā jiā de shíhou, fàncài dōu zuò hǎo le. Liú yéye hái zhǔnbèi le nǎichá. Yīnwèi chī le tài duō dōngxi, wǒmen chī wán fàn shì zǒu huí jiǔdiàn de.",en:"The day before returning home, we went to Sister Yixue's place. By the time we arrived, the meal was ready. Grandpa Liu had also prepared milk tea. Because we ate too much, we walked back to the hotel after the meal."}],vocab:{seg:[{b:1},{t:"前一天，我们去一雪姐家了。到她家的时候，饭菜都做好了。刘爷爷还准备了"},{b:2},{t:"。因为吃了太多东西，我们吃完饭是走回"},{b:3},{t:"的。"}],answers:["回国","奶茶","酒店"],tiles:{回国:{py:"huíguó",en:"to return to one's home country"},奶茶:{py:"nǎichá",en:"bubble tea"},酒店:{py:"jiǔdiàn",en:"hotel"}}},grammar:{before:"回国前一天，我们去一雪姐家了。到她家的时候，",after:"。刘爷爷还准备了奶茶。因为吃了太多东西，我们吃完饭是走回酒店的。",answer:"饭菜都做好了",tokens:["饭菜","都","做好","了"]},sentences:[{speaker:"",text:"回国前一天，我们去一雪姐家了。",tokens:["回国","前","一","天","我们","去","一","雪","姐","家","了"]},{speaker:"",text:"刘爷爷还准备了奶茶。",tokens:["刘","爷爷","还","准备","了","奶茶"]},{speaker:"",text:"因为吃了太多东西，我们吃完饭是走回酒店的。",tokens:["因为","吃","了","太","多","东西","我们","吃","完","饭","是","走","回","酒店","的"]},{speaker:"",text:"到她家的时候，饭菜都做好了。",tokens:["到","她","家","的","时候","饭菜","都","做好","了"]}],note:"简单趋向补语（1）；简单趋向补语（2）；固定格式“都……了”"}]},{num:6,name:"小雪，生日快乐！",texts:[{n:1,title:"课文1",original:`王一雪：明天就是女儿的生日了。
刘明：你不说，我还真忘了。我们给她准备个什么礼物呢？
王一雪：她喜欢画画，你觉得画笔怎么样？
刘明：就送画笔吧！
王一雪：那我明天上午就去买。
刘明：好！我再给她买个大大的生日蛋糕。`,lines:[{name:"王一雪",zh:"明天就是女儿的生日了。",py:"Míngtiān jiù shì nǚ'ér de shēngrì le.",en:"Tomorrow is our daughter's birthday."},{name:"刘明",zh:"你不说，我还真忘了。我们给她准备个什么礼物呢？",py:"Nǐ bù shuō, wǒ hái zhēn wàng le. Wǒmen gěi tā zhǔnbèi ge shénme lǐwù ne?",en:"If you hadn't mentioned it, I'd have forgotten. What gift should we get her?"},{name:"王一雪",zh:"她喜欢画画，你觉得画笔怎么样？",py:"Tā xǐhuan huà huà, nǐ juéde huàbǐ zěnmeyàng?",en:"She likes drawing—how about some paintbrushes?"},{name:"刘明",zh:"就送画笔吧！",py:"Jiù sòng huàbǐ ba!",en:"Paintbrushes it is!"},{name:"王一雪",zh:"那我明天上午就去买。",py:"Nà wǒ míngtiān shàngwǔ jiù qù mǎi.",en:"Then I'll go buy them tomorrow morning."},{name:"刘明",zh:"好！我再给她买个大大的生日蛋糕。",py:"Hǎo! Wǒ zài gěi tā mǎi ge dàdà de shēngrì dàngāo.",en:"Great! And I'll buy her a big birthday cake."}],vocab:{seg:[{t:"王一雪：明天就是女儿的"},{b:1},{t:`了。
刘明：你不说，我还真`},{b:2},{t:`了。我们给她准备个什么礼物呢？
王一雪：她喜欢`},{b:3},{t:"，你觉得"},{b:4},{t:`怎么样？
刘明：就送画笔吧！
王一雪：那我明天上午就去买。
刘明：好！我再给她买个大大的生日`},{b:5},{t:"。"}],answers:["生日","忘","画画","画笔","蛋糕"],tiles:{生日:{py:"shēngrì",en:"birthday"},忘:{py:"wàng",en:"to forget"},画画:{py:"huà huà",en:"to draw; to paint"},画笔:{py:"huàbǐ",en:"paintbrush; colored pen"},蛋糕:{py:"dàngāo",en:"cake"}}},grammar:{before:`王一雪：明天就是女儿的生日了。
刘明：你不说，我还真忘了。我们给她准备个什么礼物呢？
王一雪：她喜欢画画，你觉得画笔怎么样？
刘明：就送画笔吧！
王一雪：那我明天上午就去买。
刘明：好！我再给她买个`,after:"。",answer:"大大的生日蛋糕",tokens:["大大的","生日蛋糕"]},sentences:[{speaker:"王一雪",text:"明天就是女儿的生日了。",tokens:["明天","就是","女儿","的","生日","了"]},{speaker:"刘明",text:"你不说，我还真忘了。",tokens:["你","不","说","我","还","真","忘","了"]},{speaker:"王一雪",text:"她喜欢画画，你觉得画笔怎么样？",tokens:["她","喜欢","画画","你","觉得","画笔","怎么样"]},{speaker:"刘明",text:"就送画笔吧！",tokens:["就","送","画笔","吧"]},{speaker:"刘明",text:"我再给她买个大大的生日蛋糕。",tokens:["我","再","给","她","买","个","大大的","生日蛋糕"]},{speaker:"刘明",text:"我们给她准备个什么礼物呢？",tokens:["我们","给","她","准备","个","什么","礼物","呢"]},{speaker:"王一雪",text:"那我明天上午就去买。",tokens:["那","我","明天","上午","就","去","买"]}],note:"形容词重叠；固定短语“什么的”；结构助词“地”"},{n:2,title:"课文2",original:`刘明：小雪，生日快乐！
刘小明：姐姐，生日快乐！
王一雪：小雪，这是爸爸、妈妈送你的礼物。
刘明：你打开看看喜欢不喜欢。
刘小雪：画笔！我很喜欢！
王一雪：你想画什么？
刘小雪：画我们的家！有爸爸、妈妈、弟弟，还有黑色的狗、白色的猫什么的。
刘小明：那我要画一个穿白色衣服的姐姐。`,lines:[{name:"刘明",zh:"小雪，生日快乐！",py:"Xiǎoxuě, shēngrì kuàilè!",en:"Xiaoxue, happy birthday!"},{name:"刘小明",zh:"姐姐，生日快乐！",py:"Jiějie, shēngrì kuàilè!",en:"Happy birthday, big sister!"},{name:"王一雪",zh:"小雪，这是爸爸、妈妈送你的礼物。",py:"Xiǎoxuě, zhè shì bàba, māma sòng nǐ de lǐwù.",en:"Xiaoxue, this is a gift from Mom and Dad."},{name:"刘明",zh:"你打开看看喜欢不喜欢。",py:"Nǐ dǎkāi kànkan xǐhuan bu xǐhuan.",en:"Open it and see if you like it."},{name:"刘小雪",zh:"画笔！我很喜欢！",py:"Huàbǐ! Wǒ hěn xǐhuan!",en:"Paintbrushes! I love them!"},{name:"王一雪",zh:"你想画什么？",py:"Nǐ xiǎng huà shénme?",en:"What do you want to draw?"},{name:"刘小雪",zh:"画我们的家！有爸爸、妈妈、弟弟，还有黑色的狗、白色的猫什么的。",py:"Huà wǒmen de jiā! Yǒu bàba, māma, dìdi, háiyǒu hēisè de gǒu, báisè de māo shénme de.",en:"Our family! With Dad, Mom, little brother, and a black dog, a white cat, and so on."},{name:"刘小明",zh:"那我要画一个穿白色衣服的姐姐。",py:"Nà wǒ yào huà yí ge chuān báisè yīfu de jiějie.",en:"Then I'll draw my big sister in white clothes."}],vocab:{seg:[{t:"刘明：小雪，"},{b:1},{t:`快乐！
刘小明：姐姐，生日快乐！
王一雪：小雪，这是爸爸、妈妈送你的礼物。
刘明：你`},{b:2},{t:`看看喜欢不喜欢。
刘小雪：`},{b:3},{t:`！我很喜欢！
王一雪：你想画什么？
刘小雪：画我们的家！有爸爸、妈妈、`},{b:4},{t:`，还有黑色的狗、白色的猫什么的。
刘小明：那我要画一个穿白色衣服的姐姐。`}],answers:["生日","打开","画笔","弟弟"],tiles:{生日:{py:"shēngrì",en:"birthday"},打开:{py:"dǎkāi",en:"to open"},画笔:{py:"huàbǐ",en:"paintbrush; colored pen"},弟弟:{py:"dìdi",en:"younger brother"}}},grammar:{before:`刘明：小雪，生日快乐！
刘小明：姐姐，生日快乐！
王一雪：小雪，这是爸爸、妈妈送你的礼物。
刘明：你打开看看喜欢不喜欢。
刘小雪：画笔！我很喜欢！
王一雪：你想画什么？
刘小雪：画我们的家！有爸爸、妈妈、弟弟，还有黑色的狗、`,after:`。
刘小明：那我要画一个穿白色衣服的姐姐。`,answer:"白色的猫什么的",tokens:["白色","的","猫","什么","的"]},sentences:[{speaker:"刘明",text:"小雪，生日快乐！",tokens:["小雪","生日","快乐"]},{speaker:"刘小明",text:"姐姐，生日快乐！",tokens:["姐姐","生日","快乐"]},{speaker:"刘明",text:"你打开看看喜欢不喜欢。",tokens:["你","打开","看看","喜欢","不","喜欢"]},{speaker:"刘小雪",text:"有爸爸、妈妈、弟弟，还有黑色的狗、白色的猫什么的。",tokens:["有","爸爸","妈妈","弟弟","还有","黑色","的","狗","白色","的","猫","什么","的"]},{speaker:"王一雪",text:"小雪，这是爸爸、妈妈送你的礼物。",tokens:["小雪","这","是","爸爸","妈妈","送","你","的","礼物"]},{speaker:"刘小雪",text:"我很喜欢！",tokens:["我","很","喜欢"]},{speaker:"王一雪",text:"你想画什么？",tokens:["你","想","画","什么"]},{speaker:"刘小雪",text:"画我们的家！",tokens:["画","我们","的","家"]},{speaker:"刘小明",text:"那我要画一个穿白色衣服的姐姐。",tokens:["那","我","要","画","一个","穿","白色","衣服","的","姐姐"]}],note:"形容词重叠；固定短语“什么的”；结构助词“地”"},{n:3,title:"课文3",original:`刘明：小雪，看看今天有什么好吃的。
刘小雪：长长的面条儿，大大的蛋糕。
刘明：你看，还有鱼啊肉啊什么的，都是你喜欢吃的。
刘小雪：谢谢爸爸、妈妈！
王一雪：快去叫弟弟过来吃饭吧，吃完饭我们还要出去玩呢。
刘小雪：生日真好啊！
王一雪：是的，过生日就要吃好吃的，还要高高兴兴地玩。`,lines:[{name:"刘明",zh:"小雪，看看今天有什么好吃的。",py:"Xiǎoxuě, kànkan jīntiān yǒu shénme hǎochī de.",en:"Xiaoxue, look at all the good food today."},{name:"刘小雪",zh:"长长的面条儿，大大的蛋糕。",py:"Chángcháng de miàntiáor, dàdà de dàngāo.",en:"Long noodles and a big cake."},{name:"刘明",zh:"你看，还有鱼啊肉啊什么的，都是你喜欢吃的。",py:"Nǐ kàn, háiyǒu yú a ròu a shénme de, dōu shì nǐ xǐhuan chī de.",en:"Look, there's fish and meat and so on—all your favorites."},{name:"刘小雪",zh:"谢谢爸爸、妈妈！",py:"Xièxie bàba, māma!",en:"Thank you, Mom and Dad!"},{name:"王一雪",zh:"快去叫弟弟过来吃饭吧，吃完饭我们还要出去玩呢。",py:"Kuài qù jiào dìdi guòlai chī fàn ba, chī wán fàn wǒmen hái yào chūqu wán ne.",en:"Go call your little brother to come eat—after the meal we're going out to have fun."},{name:"刘小雪",zh:"生日真好啊！",py:"Shēngrì zhēn hǎo a!",en:"Birthdays are wonderful!"},{name:"王一雪",zh:"是的，过生日就要吃好吃的，还要高高兴兴地玩。",py:"Shì de, guò shēngrì jiù yào chī hǎochī de, hái yào gāogāoxìngxìng de wán.",en:"Yes—on your birthday you eat good food and have a joyful time."}],vocab:{seg:[{t:`刘明：小雪，看看今天有什么好吃的。
刘小雪：长长的`},{b:1},{t:"，大大的"},{b:2},{t:`。
刘明：你看，还有鱼啊`},{b:3},{t:`啊什么的，都是你喜欢吃的。
刘小雪：谢谢爸爸、妈妈！
王一雪：快去叫`},{b:4},{t:`过来吃饭吧，吃完饭我们还要出去玩呢。
刘小雪：生日真好啊！
王一雪：是的，过生日就要吃好吃的，还要高高兴兴地玩。`}],answers:["面条儿","蛋糕","肉","弟弟"],tiles:{面条儿:{py:"miàntiáor",en:"noodles"},蛋糕:{py:"dàngāo",en:"cake"},肉:{py:"ròu",en:"meat"},弟弟:{py:"dìdi",en:"younger brother"}}},grammar:{before:`刘明：小雪，看看今天有什么好吃的。
刘小雪：长长的面条儿，大大的蛋糕。
刘明：你看，还有鱼啊肉啊什么的，都是你喜欢吃的。
刘小雪：谢谢爸爸、妈妈！
王一雪：快去叫弟弟过来吃饭吧，吃完饭我们还要出去玩呢。
刘小雪：生日真好啊！
王一雪：是的，过生日就要吃好吃的，还要`,after:"。",answer:"高高兴兴地玩",tokens:["高高兴兴","地","玩"]},sentences:[{speaker:"刘小雪",text:"长长的面条儿，大大的蛋糕。",tokens:["长","长","的","面条儿","大大的","蛋糕"]},{speaker:"刘明",text:"你看，还有鱼啊肉啊什么的，都是你喜欢吃的。",tokens:["你","看","还有","鱼","啊","肉","啊","什么","的","都","是","你","喜欢","吃","的"]},{speaker:"王一雪",text:"快去叫弟弟过来吃饭吧，吃完饭我们还要出去玩呢。",tokens:["快","去","叫","弟弟","过来","吃饭","吧","吃","完","饭","我们","还要","出去","玩","呢"]},{speaker:"刘明",text:"小雪，看看今天有什么好吃的。",tokens:["小雪","看看","今天","有","什么","好吃","的"]},{speaker:"刘小雪",text:"谢谢爸爸、妈妈！",tokens:["谢谢","爸爸","妈妈"]},{speaker:"刘小雪",text:"生日真好啊！",tokens:["生日","真","好","啊"]},{speaker:"王一雪",text:"是的，过生日就要吃好吃的，还要高高兴兴地玩。",tokens:["是","的","过","生日","就要","吃","好吃","的","还要","高高兴兴","地","玩"]}],note:"形容词重叠；固定短语“什么的”；结构助词“地”"},{n:4,title:"课文4",original:"今天是女儿的生日。我们买了蛋糕，做了面条儿，还做了鱼啊肉啊什么的。吃完晚饭，一家人去看了个电影。回家后，孩子们早早地就上床了。明天不上学，他们说要舒舒服服地睡一觉，让我们晚点儿叫他们起床。这是很忙、很累，但很快乐的一天。",lines:[{name:"",zh:"今天是女儿的生日。我们买了蛋糕，做了面条儿，还做了鱼啊肉啊什么的。吃完晚饭，一家人去看了个电影。回家后，孩子们早早地就上床了。明天不上学，他们说要舒舒服服地睡一觉，让我们晚点儿叫他们起床。这是很忙、很累，但很快乐的一天。",py:"Jīntiān shì nǚ'ér de shēngrì. Wǒmen mǎi le dàngāo, zuò le miàntiáor, hái zuò le yú a ròu a shénme de. Chī wán wǎnfàn, yìjiā rén qù kàn le ge diànyǐng. Huí jiā hòu, háizimen zǎozǎo de jiù shàngchuáng le. Míngtiān bú shàngxué, tāmen shuō yào shūshūfúfú de shuì yí jiào, ràng wǒmen wǎn diǎnr jiào tāmen qǐchuáng. Zhè shì hěn máng, hěn lèi, dàn hěn kuàilè de yì tiān.",en:"Today is our daughter's birthday. We bought a cake, made noodles, and cooked fish, meat, and so on. After dinner, the whole family went to see a movie. Back home, the children went to bed early. There's no school tomorrow, so they said they want to sleep in comfortably and asked us to wake them up later. It was a busy, tiring, but very happy day."}],vocab:{seg:[{t:"今天是女儿的生日。我们买了蛋糕，做了面条儿，还做了鱼啊肉啊什么的。吃完晚饭，一家人去看了个电影。回家后，孩子们早早地就上床了。明天不上学，他们说要舒"},{b:1},{t:"服地睡一觉，让我们晚点儿叫他们"},{b:2},{t:"。这是很忙、很累，但很"},{b:3},{t:"的一天。"}],answers:["舒服","起床","快乐"],tiles:{舒服:{py:"shūfu",en:"comfortable; well"},起床:{py:"qǐchuáng",en:"to get up"},快乐:{py:"kuàilè",en:"happy"}}},grammar:{before:"今天是女儿的生日。我们买了蛋糕，做了面条儿，还做了鱼啊肉啊什么的。吃完晚饭，一家人去看了个电影。回家后，孩子们早早地就上床了。明天不上学，他们说要",after:"，让我们晚点儿叫他们起床。这是很忙、很累，但很快乐的一天。",answer:"舒舒服服地睡一觉",tokens:["舒舒服服","地","睡一觉"]},sentences:[{speaker:"",text:"这是很忙、很累，但很快乐的一天。",tokens:["这","是","很","忙","很","累","但","很","快乐","的","一","天"]},{speaker:"",text:"今天是女儿的生日。",tokens:["今天","是","女儿","的","生日"]},{speaker:"",text:"吃完晚饭，一家人去看了个电影。",tokens:["吃","完","晚饭","一家","人","去","看","了","个","电影"]},{speaker:"",text:"回家后，孩子们早早地就上床了。",tokens:["回家","后","孩子","们","早","早","地","就","上","床","了"]}],note:"形容词重叠；固定短语“什么的”；结构助词“地”"}]},{num:7,name:"他篮球打得很好",texts:[{n:1,title:"课文1",original:`陈天中：安妮，你是什么时候从北京回来的？
安妮：昨天下午。天中，你怎么一下课就往外跑？
陈天中：我跟同学说好了，一起去打篮球。
安妮：我也想跟你们一起玩。
陈天中：没问题，走吧。`,lines:[{name:"陈天中",zh:"安妮，你是什么时候从北京回来的？",py:"Ānnī, nǐ shì shénme shíhou cóng Běijīng huílai de?",en:"Annie, when did you get back from Beijing?"},{name:"安妮",zh:"昨天下午。天中，你怎么一下课就往外跑？",py:"Zuótiān xiàwǔ. Tiānzhōng, nǐ zěnme yí xiàkè jiù wǎng wài pǎo?",en:"Yesterday afternoon. Tianzhong, why do you dash outside the moment class ends?"},{name:"陈天中",zh:"我跟同学说好了，一起去打篮球。",py:"Wǒ gēn tóngxué shuōhǎo le, yìqǐ qù dǎ lánqiú.",en:"I arranged with classmates to go play basketball together."},{name:"安妮",zh:"我也想跟你们一起玩。",py:"Wǒ yě xiǎng gēn nǐmen yìqǐ wán.",en:"I'd like to join you too."},{name:"陈天中",zh:"没问题，走吧。",py:"Méi wèntí, zǒu ba.",en:"No problem, let's go."}],vocab:{seg:[{t:"陈天中：安妮，你是什么时候从北京"},{b:1},{t:`的？
安妮：昨天下午。天中，你怎么一下课就`},{b:2},{t:`跑？
陈天中：我跟同学说好了，一起去`},{b:3},{t:`。
安妮：我也想跟你们一起玩。
陈天中：没问题，走吧。`}],answers:["回来","往外","打篮球"],tiles:{回来:{py:"huílai",en:"to come back; return"},往外:{py:"wǎng wài",en:"outward; toward the outside"},打篮球:{py:"dǎ lánqiú",en:"to play basketball"}}},grammar:{before:`陈天中：安妮，你是什么时候从北京回来的？
安妮：昨天下午。天中，你怎么`,after:`？
陈天中：我跟同学说好了，一起去打篮球。
安妮：我也想跟你们一起玩。
陈天中：没问题，走吧。`,answer:"一下课就往外跑",tokens:["一","下课","就","往外","跑"]},sentences:[{speaker:"陈天中",text:"安妮，你是什么时候从北京回来的？",tokens:["安妮","你","是","什么","时候","从","北京","回来","的"]},{speaker:"安妮",text:"天中，你怎么一下课就往外跑？",tokens:["天","中","你","怎么","一下","课","就","往外","跑"]},{speaker:"陈天中",text:"我跟同学说好了，一起去打篮球。",tokens:["我","跟","同学","说","好","了","一起","去","打篮球"]},{speaker:"安妮",text:"昨天下午。",tokens:["昨天","下午"]},{speaker:"安妮",text:"我也想跟你们一起玩。",tokens:["我","也","想","跟","你们","一起","玩"]},{speaker:"陈天中",text:"没问题，走吧。",tokens:["没问题","走","吧"]}],note:"紧缩复句“一……就……”；状态补语（1）；状态补语（2）"},{n:2,title:"课文2",original:`安妮：天中，你是不是很喜欢打篮球？
陈天中：没错。
安妮：你还喜欢什么运动？
陈天中：我还喜欢踢足球，一到星期天就跟朋友们一起踢。
安妮：你踢得怎么样？
陈天中：我踢得还可以。`,lines:[{name:"安妮",zh:"天中，你是不是很喜欢打篮球？",py:"Tiānzhōng, nǐ shì bu shì hěn xǐhuan dǎ lánqiú?",en:"Tianzhong, do you really like playing basketball?"},{name:"陈天中",zh:"没错。",py:"Méicuò.",en:"That's right."},{name:"安妮",zh:"你还喜欢什么运动？",py:"Nǐ hái xǐhuan shénme yùndòng?",en:"What other sports do you like?"},{name:"陈天中",zh:"我还喜欢踢足球，一到星期天就跟朋友们一起踢。",py:"Wǒ hái xǐhuan tī zúqiú, yí dào xīngqītiān jiù gēn péngyoumen yìqǐ tī.",en:"I also like soccer—every Sunday I play with friends."},{name:"安妮",zh:"你踢得怎么样？",py:"Nǐ tī de zěnmeyàng?",en:"How well do you play?"},{name:"陈天中",zh:"我踢得还可以。",py:"Wǒ tī de hái kěyǐ.",en:"I play okay."}],vocab:{seg:[{t:`安妮：天中，你是不是很喜欢打篮球？
陈天中：没错。
安妮：你还喜欢什么`},{b:1},{t:`？
陈天中：我还喜欢`},{b:2},{t:`，一到星期天就跟朋友们一起踢。
安妮：你踢得怎么样？
陈天中：我踢得还可以。`}],answers:["运动","踢足球"],tiles:{运动:{py:"yùndòng",en:"sport; to exercise"},踢足球:{py:"tī zúqiú",en:"to play football/soccer"}}},grammar:{before:`安妮：天中，你是不是很喜欢打篮球？
陈天中：没错。
安妮：你还喜欢什么运动？
陈天中：我还喜欢踢足球，一到星期天就跟朋友们一起踢。
安妮：`,after:`？
陈天中：我踢得还可以。`,answer:"你踢得怎么样",tokens:["你","踢","得","怎么样"]},sentences:[{speaker:"安妮",text:"你还喜欢什么运动？",tokens:["你","还","喜欢","什么","运动"]},{speaker:"陈天中",text:"我还喜欢踢足球，一到星期天就跟朋友们一起踢。",tokens:["我","还","喜欢","踢足球","一","到","星期天","就","跟","朋友","们","一起","踢"]},{speaker:"安妮",text:"天中，你是不是很喜欢打篮球？",tokens:["天","中","你","是不是","很","喜欢","打篮球"]},{speaker:"陈天中",text:"没错。",tokens:["没","错"]},{speaker:"安妮",text:"你踢得怎么样？",tokens:["你","踢","得","怎么样"]},{speaker:"陈天中",text:"我踢得还可以。",tokens:["我","踢","得","还可以"]}],note:"紧缩复句“一……就……”；状态补语（1）；状态补语（2）"},{n:3,title:"课文3",original:`陈天中：你篮球打得怎么样？
安妮：打得还可以。
陈天中：你跑得快不快？
安妮：我跑得不快，也不太喜欢跑步。
陈天中：那你喜欢游泳吗？
安妮：喜欢，但我游泳游得不快。`,lines:[{name:"陈天中",zh:"你篮球打得怎么样？",py:"Nǐ lánqiú dǎ de zěnmeyàng?",en:"How well do you play basketball?"},{name:"安妮",zh:"打得还可以。",py:"Dǎ de hái kěyǐ.",en:"I play okay."},{name:"陈天中",zh:"你跑得快不快？",py:"Nǐ pǎo de kuài bu kuài?",en:"Do you run fast?"},{name:"安妮",zh:"我跑得不快，也不太喜欢跑步。",py:"Wǒ pǎo de bú kuài, yě bú tài xǐhuan pǎobù.",en:"I don't run fast, and I don't really like running."},{name:"陈天中",zh:"那你喜欢游泳吗？",py:"Nà nǐ xǐhuan yóuyǒng ma?",en:"Then do you like swimming?"},{name:"安妮",zh:"喜欢，但我游泳游得不快。",py:"Xǐhuan, dàn wǒ yóuyǒng yóu de bú kuài.",en:"Yes, but I don't swim fast."}],vocab:{seg:[{t:"陈天中：你"},{b:1},{t:`打得怎么样？
安妮：打得还可以。
陈天中：你跑得快不快？
安妮：我跑得不快，也不太喜欢`},{b:2},{t:`。
陈天中：那你喜欢`},{b:3},{t:`吗？
安妮：喜欢，但我游泳游得不快。`}],answers:["篮球","跑步","游泳"],tiles:{篮球:{py:"lánqiú",en:"basketball"},跑步:{py:"pǎobù",en:"to run; jog"},游泳:{py:"yóuyǒng",en:"to swim"}}},grammar:{before:"陈天中：",after:`？
安妮：打得还可以。
陈天中：你跑得快不快？
安妮：我跑得不快，也不太喜欢跑步。
陈天中：那你喜欢游泳吗？
安妮：喜欢，但我游泳游得不快。`,answer:"你篮球打得怎么样",tokens:["你","篮球","打","得","怎么样"]},sentences:[{speaker:"陈天中",text:"你篮球打得怎么样？",tokens:["你","篮球","打","得","怎么样"]},{speaker:"安妮",text:"我跑得不快，也不太喜欢跑步。",tokens:["我","跑","得","不","快","也","不太","喜欢","跑步"]},{speaker:"陈天中",text:"那你喜欢游泳吗？",tokens:["那","你","喜欢","游泳","吗"]},{speaker:"安妮",text:"喜欢，但我游泳游得不快。",tokens:["喜欢","但","我","游泳","游","得","不","快"]},{speaker:"安妮",text:"打得还可以。",tokens:["打","得","还可以"]},{speaker:"陈天中",text:"你跑得快不快？",tokens:["你","跑","得","快","不","快"]}],note:"紧缩复句“一……就……”；状态补语（1）；状态补语（2）"},{n:4,title:"课文4",original:"我的爱好是运动。从上小学开始，我每天都跟爸爸去运动。现在我篮球打得很好，足球踢得不错，游泳游得也很快。我一有时间就去运动。",lines:[{name:"",zh:"我的爱好是运动。从上小学开始，我每天都跟爸爸去运动。现在我篮球打得很好，足球踢得不错，游泳游得也很快。我一有时间就去运动。",py:"Wǒ de àihào shì yùndòng. Cóng shàng xiǎoxué kāishǐ, wǒ měi tiān dōu gēn bàba qù yùndòng. Xiànzài wǒ lánqiú dǎ de hěn hǎo, zúqiú tī de búcuò, yóuyǒng yóu de yě hěn kuài. Wǒ yì yǒu shíjiān jiù qù yùndòng.",en:"My hobby is sports. Ever since primary school, I've gone exercising with my dad every day. Now I play basketball very well, soccer pretty well, and swim fast too. Whenever I have time, I go exercise."}],vocab:{seg:[{t:"我的"},{b:1},{t:"是"},{b:2},{t:"。从上小学开始，我每天都跟爸爸去运动。现在我篮球打得很好，"},{b:3},{t:"踢得不错，"},{b:4},{t:"游得也很快。我一有时间就去运动。"}],answers:["爱好","运动","足球","游泳"],tiles:{爱好:{py:"àihào",en:"hobby; interest"},运动:{py:"yùndòng",en:"sport; to exercise"},足球:{py:"zúqiú",en:"football; soccer"},游泳:{py:"yóuyǒng",en:"to swim"}}},grammar:{before:"我的爱好是运动。从上小学开始，我每天都跟爸爸去运动。现在我篮球打得很好，足球踢得不错，",after:"。我一有时间就去运动。",answer:"游泳游得也很快",tokens:["游泳","游","得","也","很","快"]},sentences:[{speaker:"",text:"我的爱好是运动。",tokens:["我","的","爱好","是","运动"]},{speaker:"",text:"从上小学开始，我每天都跟爸爸去运动。",tokens:["从","上","小学","开始","我","每天","都","跟","爸爸","去","运动"]},{speaker:"",text:"我一有时间就去运动。",tokens:["我","一","有时","间","就","去","运动"]}],note:"紧缩复句“一……就……”；状态补语（1）；状态补语（2）"}]},{num:8,name:"虽然你忘了，但是我记得",texts:[{n:1,title:"课文1",original:`王一雪：你看，这两块手表怎么样？
刘明：都不错！
王一雪：我喜欢左边这个。
刘明：我也觉得左边的比右边的好看。
王一雪：你看看要多少钱！
刘明：不便宜！8800元！`,lines:[{name:"王一雪",zh:"你看，这两块手表怎么样？",py:"Nǐ kàn, zhè liǎng kuài shǒubiǎo zěnmeyàng?",en:"Look—what do you think of these two watches?"},{name:"刘明",zh:"都不错！",py:"Dōu búcuò!",en:"Both are nice!"},{name:"王一雪",zh:"我喜欢左边这个。",py:"Wǒ xǐhuan zuǒbian zhège.",en:"I like the one on the left."},{name:"刘明",zh:"我也觉得左边的比右边的好看。",py:"Wǒ yě juéde zuǒbian de bǐ yòubian de hǎokàn.",en:"I also think the left one looks better than the right one."},{name:"王一雪",zh:"你看看要多少钱！",py:"Nǐ kànkan yào duōshao qián!",en:"Look at how much it costs!"},{name:"刘明",zh:"不便宜！8800元！",py:"Bù piányi! Bāqiān bā bǎi yuán!",en:"Not cheap! 8,800 yuan!"}],vocab:{seg:[{t:"王一雪：你看，这两块"},{b:1},{t:`怎么样？
刘明：都不错！
王一雪：我喜欢`},{b:2},{t:`这个。
刘明：我也觉得左边的比`},{b:3},{t:`的好看。
王一雪：你看看要多少钱！
刘明：不`},{b:4},{t:"！8800元！"}],answers:["手表","左边","右边","便宜"],tiles:{手表:{py:"shǒubiǎo",en:"wristwatch"},左边:{py:"zuǒbian",en:"left side"},右边:{py:"yòubian",en:"right side"},便宜:{py:"piányi",en:"cheap"}}},grammar:{before:`王一雪：你看，这两块手表怎么样？
刘明：都不错！
王一雪：我喜欢左边这个。
刘明：我也觉得`,after:`。
王一雪：你看看要多少钱！
刘明：不便宜！8800元！`,answer:"左边的比右边的好看",tokens:["左边","的","比","右边","的","好看"]},sentences:[{speaker:"王一雪",text:"你看，这两块手表怎么样？",tokens:["你","看","这","两","块","手表","怎么样"]},{speaker:"王一雪",text:"我喜欢左边这个。",tokens:["我","喜欢","左边","这个"]},{speaker:"刘明",text:"我也觉得左边的比右边的好看。",tokens:["我","也","觉得","左边","的","比","右边","的","好看"]},{speaker:"刘明",text:"不便宜！",tokens:["不","便宜"]},{speaker:"刘明",text:"都不错！",tokens:["都","不错"]},{speaker:"王一雪",text:"你看看要多少钱！",tokens:["你","看看","要","多少","钱"]},{speaker:"刘明",text:"8800元！",tokens:["8","8","0","0","元"]}],note:"比较句（1）；比较句（2）；转折复句“虽然……，但是……”"},{n:2,title:"课文2",original:`刘明：今天有不少电影，我们看个电影吧。
王一雪：好啊！我们看哪个？
刘明：我记得你喜欢看爱情片，我们看那个爱情片，怎么样？
王一雪：还是看这个吧，我看网上说这个电影比那个爱情片更有意思。
刘明：好啊，我去买票。
王一雪：到网上买吧，网上买比在这里买便宜。`,lines:[{name:"刘明",zh:"今天有不少电影，我们看个电影吧。",py:"Jīntiān yǒu bù shǎo diànyǐng, wǒmen kàn ge diànyǐng ba.",en:"There are lots of movies today—let's watch one."},{name:"王一雪",zh:"好啊！我们看哪个？",py:"Hǎo a! Wǒmen kàn nǎge?",en:"Sure! Which one should we watch?"},{name:"刘明",zh:"我记得你喜欢看爱情片，我们看那个爱情片，怎么样？",py:"Wǒ jìde nǐ xǐhuan kàn àiqíngpiàn, wǒmen kàn nàge àiqíngpiàn, zěnmeyàng?",en:"I remember you like romance films—how about that romance one?"},{name:"王一雪",zh:"还是看这个吧，我看网上说这个电影比那个爱情片更有意思。",py:"Háishi kàn zhège ba, wǒ kàn wǎng shàng shuō zhège diànyǐng bǐ nàge àiqíngpiàn gèng yǒu yìsi.",en:"Let's watch this one instead—online it says this movie is more interesting than that romance film."},{name:"刘明",zh:"好啊，我去买票。",py:"Hǎo a, wǒ qù mǎi piào.",en:"Okay, I'll go buy tickets."},{name:"王一雪",zh:"到网上买吧，网上买比在这里买便宜。",py:"Dào wǎng shàng mǎi ba, wǎng shàng mǎi bǐ zài zhèlǐ mǎi piányi.",en:"Buy them online—it's cheaper than buying here."}],vocab:{seg:[{t:"刘明：今天有不少"},{b:1},{t:`，我们看个电影吧。
王一雪：好啊！我们看哪个？
刘明：我记得你喜欢看`},{b:2},{t:`，我们看那个爱情片，怎么样？
王一雪：还是看这个吧，我看`},{b:3},{t:`说这个电影比那个爱情片更有意思。
刘明：好啊，我去买票。
王一雪：到网上买吧，网上买比在这里买`},{b:4},{t:"。"}],answers:["电影","爱情片","网上","便宜"],tiles:{电影:{py:"diànyǐng",en:"movie; film"},爱情片:{py:"àiqíngpiàn",en:"romantic movie"},网上:{py:"wǎngshàng",en:"online"},便宜:{py:"piányi",en:"cheap"}}},grammar:{before:`刘明：今天有不少电影，我们看个电影吧。
王一雪：好啊！我们看哪个？
刘明：我记得你喜欢看爱情片，我们看那个爱情片，怎么样？
王一雪：还是看这个吧，我看网上说`,after:`。
刘明：好啊，我去买票。
王一雪：到网上买吧，网上买比在这里买便宜。`,answer:"这个电影比那个爱情片更有意思",tokens:["这个","电影","比","那个","爱情片","更","有意思"]},sentences:[{speaker:"刘明",text:"今天有不少电影，我们看个电影吧。",tokens:["今天","有","不少","电影","我们","看","个","电影","吧"]},{speaker:"刘明",text:"我记得你喜欢看爱情片，我们看那个爱情片，怎么样？",tokens:["我","记得","你","喜欢","看","爱情片","我们","看","那个","爱情片","怎么样"]},{speaker:"王一雪",text:"还是看这个吧，我看网上说这个电影比那个爱情片更有意思。",tokens:["还是","看","这个","吧","我","看","网上","说","这个","电影","比","那个","爱情片","更","有意思"]},{speaker:"王一雪",text:"到网上买吧，网上买比在这里买便宜。",tokens:["到","网上","买","吧","网上","买","比","在","这里","买","便宜"]},{speaker:"王一雪",text:"好啊！",tokens:["好","啊"]},{speaker:"王一雪",text:"我们看哪个？",tokens:["我们","看","哪个"]},{speaker:"刘明",text:"好啊，我去买票。",tokens:["好","啊","我","去","买","票"]}],note:"比较句（1）；比较句（2）；转折复句“虽然……，但是……”"},{n:3,title:"课文3",original:`刘明：您好！就要这几个菜吧，谢谢！
王一雪：怎么点这么多菜？
刘明：你想想，今天是几月几号？
王一雪：8月27号。啊！我的生日！
刘明：生日快乐！虽然你忘了，但是我记得。看看这是什么？
王一雪：手表！吃饭、看电影、买手表，今天花了不少钱吧？
刘明：虽然花了一些钱，但是我们过了一个快乐的生日。`,lines:[{name:"刘明",zh:"您好！就要这几个菜吧，谢谢！",py:"Nín hǎo! Jiù yào zhè jǐ ge cài ba, xièxie!",en:"Hello! We'll just have these dishes, thanks!"},{name:"王一雪",zh:"怎么点这么多菜？",py:"Zěnme diǎn zhème duō cài?",en:"Why did you order so many dishes?"},{name:"刘明",zh:"你想想，今天是几月几号？",py:"Nǐ xiǎngxiang, jīntiān shì jǐ yuè jǐ hào?",en:"Think about it—what's the date today?"},{name:"王一雪",zh:"8月27号。啊！我的生日！",py:"Bā yuè èrshíqī hào. À! Wǒ de shēngrì!",en:"August 27th. Oh! My birthday!"},{name:"刘明",zh:"生日快乐！虽然你忘了，但是我记得。看看这是什么？",py:"Shēngrì kuàilè! Suīrán nǐ wàng le, dànshì wǒ jìde. Kànkan zhè shì shénme?",en:"Happy birthday! Even though you forgot, I remembered. Look, what's this?"},{name:"王一雪",zh:"手表！吃饭、看电影、买手表，今天花了不少钱吧？",py:"Shǒubiǎo! Chī fàn, kàn diànyǐng, mǎi shǒubiǎo, jīntiān huā le bù shǎo qián ba?",en:"A watch! Dinner, a movie, a watch—you spent quite a lot today, didn't you?"},{name:"刘明",zh:"虽然花了一些钱，但是我们过了一个快乐的生日。",py:"Suīrán huā le yìxiē qián, dànshì wǒmen guò le yí ge kuàilè de shēngrì.",en:"We spent some money, but we had a happy birthday."}],vocab:{seg:[{t:"刘明：您好！就要这几个"},{b:1},{t:`吧，谢谢！
王一雪：怎么点这么多菜？
刘明：你想想，今天是几月几号？
王一雪：8月27号。啊！我的`},{b:2},{t:`！
刘明：生日`},{b:3},{t:`！虽然你忘了，但是我记得。看看这是什么？
王一雪：`},{b:4},{t:`！吃饭、看电影、买手表，今天花了不少钱吧？
刘明：虽然花了一些钱，但是我们过了一个快乐的生日。`}],answers:["菜","生日","快乐","手表"],tiles:{菜:{py:"cài",en:"dish; vegetable"},生日:{py:"shēngrì",en:"birthday"},快乐:{py:"kuàilè",en:"happy"},手表:{py:"shǒubiǎo",en:"wristwatch"}}},grammar:{before:`刘明：您好！就要这几个菜吧，谢谢！
王一雪：怎么点这么多菜？
刘明：你想想，今天是几月几号？
王一雪：8月27号。啊！我的生日！
刘明：生日快乐！虽然你忘了，但是我记得。看看这是什么？
王一雪：手表！吃饭、看电影、买手表，今天花了不少钱吧？
刘明：`,after:"我们过了一个快乐的生日。",answer:"虽然花了一些钱，但是",tokens:["虽然","花","了","一些","钱","但是"]},sentences:[{speaker:"刘明",text:"就要这几个菜吧，谢谢！",tokens:["就要","这","几","个","菜","吧","谢谢"]},{speaker:"王一雪",text:"怎么点这么多菜？",tokens:["怎么","点","这么","多","菜"]},{speaker:"王一雪",text:"我的生日！",tokens:["我","的","生日"]},{speaker:"刘明",text:"生日快乐！",tokens:["生日","快乐"]},{speaker:"王一雪",text:"吃饭、看电影、买手表，今天花了不少钱吧？",tokens:["吃饭","看","电影","买","手表","今天","花","了","不少","钱","吧"]},{speaker:"刘明",text:"虽然花了一些钱，但是我们过了一个快乐的生日。",tokens:["虽然","花","了","一些","钱","但是","我们","过","了","一个","快乐","的","生日"]},{speaker:"刘明",text:"你想想，今天是几月几号？",tokens:["你","想","想","今天","是","几","月","几号"]},{speaker:"王一雪",text:"8月27号。",tokens:["8","月","2","7","号"]},{speaker:"刘明",text:"虽然你忘了，但是我记得。",tokens:["虽然","你","忘","了","但是","我","记得"]},{speaker:"刘明",text:"看看这是什么？",tokens:["看看","这","是","什么"]}],note:"比较句（1）；比较句（2）；转折复句“虽然……，但是……”"},{n:4,title:"课文4",original:"虽然妻子忘了今天是自己的生日，但是丈夫记得。丈夫请妻子去饭馆吃饭、去电影院看电影，还给妻子买了一块非常漂亮的手表。妻子觉得今天很快乐。",lines:[{name:"",zh:"虽然妻子忘了今天是自己的生日，但是丈夫记得。丈夫请妻子去饭馆吃饭、去电影院看电影，还给妻子买了一块非常漂亮的手表。妻子觉得今天很快乐。",py:"Suīrán qīzi wàng le jīntiān shì zìjǐ de shēngrì, dànshì zhàngfu jìde. Zhàngfu qǐng qīzi qù fànguǎn chī fàn, qù diànyǐngyuàn kàn diànyǐng, hái gěi qīzi mǎi le yí kuài fēicháng piàoliang de shǒubiǎo. Qīzi juéde jīntiān hěn kuàilè.",en:"Although the wife forgot it was her own birthday, the husband remembered. He took her to a restaurant for dinner and to the cinema for a movie, and bought her a very beautiful watch. The wife felt very happy today."}],vocab:{seg:[{t:"虽然"},{b:1},{t:"忘了今天是自己的生日，但是"},{b:2},{t:"记得。丈夫请妻子去"},{b:3},{t:"吃饭、去"},{b:4},{t:"看电影，还给妻子买了一块非常漂亮的手表。妻子觉得今天很快乐。"}],answers:["妻子","丈夫","饭馆","电影院"],tiles:{妻子:{py:"qīzi",en:"wife"},丈夫:{py:"zhàngfu",en:"husband"},饭馆:{py:"fànguǎn",en:"restaurant"},电影院:{py:"diànyǐngyuàn",en:"cinema"}}},grammar:{before:"",after:"。丈夫请妻子去饭馆吃饭、去电影院看电影，还给妻子买了一块非常漂亮的手表。妻子觉得今天很快乐。",answer:"虽然妻子忘了今天是自己的生日，但是丈夫记得",tokens:["虽然","妻子","忘","了","今天","是","自己","的","生日","但是","丈夫","记得"]},sentences:[{speaker:"",text:"虽然妻子忘了今天是自己的生日，但是丈夫记得。",tokens:["虽然","妻子","忘","了","今天","是","自己","的","生日","但是","丈夫","记得"]},{speaker:"",text:"妻子觉得今天很快乐。",tokens:["妻子","觉得","今天","很","快乐"]}],note:"比较句（1）；比较句（2）；转折复句“虽然……，但是……”"}]},{num:9,name:"我去买杯奶茶",texts:[{n:1,title:"课文1",original:`王一雪：儿子的裤子坏了，我们给他买条新的吧。
刘明：好。
王一雪：你看这条黑色的怎么样？
刘明：没有你上次买的那条好看。
王一雪：旁边那个男孩儿就穿了这样的裤子，我觉得很好看啊！
刘明：儿子的个子没有他那么高，穿上就不会太好看。
王一雪：好吧，我们再去那边看看。`,lines:[{name:"王一雪",zh:"儿子的裤子坏了，我们给他买条新的吧。",py:"Érzi de kùzi huài le, wǒmen gěi tā mǎi tiáo xīn de ba.",en:"Our son's pants are worn out—let's buy him a new pair."},{name:"刘明",zh:"好。",py:"Hǎo.",en:"Okay."},{name:"王一雪",zh:"你看这条黑色的怎么样？",py:"Nǐ kàn zhè tiáo hēisè de zěnmeyàng?",en:"What do you think of these black ones?"},{name:"刘明",zh:"没有你上次买的那条好看。",py:"Méiyǒu nǐ shàng cì mǎi de nà tiáo hǎokàn.",en:"Not as nice as the pair you bought last time."},{name:"王一雪",zh:"旁边那个男孩儿就穿了这样的裤子，我觉得很好看啊！",py:"Pángbiān nàge nánháir jiù chuān le zhèyàng de kùzi, wǒ juéde hěn hǎokàn a!",en:"That boy next to us is wearing pants like these—I think they look great!"},{name:"刘明",zh:"儿子的个子没有他那么高，穿上就不会太好看。",py:"Érzi de gèzi méiyǒu tā nàme gāo, chuān shàng jiù bú huì tài hǎokàn.",en:"Our son isn't as tall as him, so they wouldn't look as good on him."},{name:"王一雪",zh:"好吧，我们再去那边看看。",py:"Hǎo ba, wǒmen zài qù nàbiān kànkan.",en:"All right, let's go look over there."}],vocab:{seg:[{t:"王一雪：儿子的"},{b:1},{t:`坏了，我们给他买条新的吧。
刘明：好。
王一雪：你看这条黑色的怎么样？
刘明：没有你上次买的那条好看。
王一雪：`},{b:2},{t:`那个男孩儿就穿了这样的裤子，我觉得很好看啊！
刘明：儿子的`},{b:3},{t:`没有他那么高，穿上就不会太好看。
王一雪：好吧，我们再去那边看看。`}],answers:["裤子","旁边","个子"],tiles:{裤子:{py:"kùzi",en:"pants; trousers"},旁边:{py:"pángbiān",en:"beside; next to"},个子:{py:"gèzi",en:"height; stature"}}},grammar:{before:`王一雪：儿子的裤子坏了，我们给他买条新的吧。
刘明：好。
王一雪：你看这条黑色的怎么样？
刘明：没有你上次买的那条好看。
王一雪：旁边那个男孩儿就穿了这样的裤子，我觉得很好看啊！
刘明：儿子的个子`,after:`，穿上就不会太好看。
王一雪：好吧，我们再去那边看看。`,answer:"没有他那么高",tokens:["没有","他","那么","高"]},sentences:[{speaker:"王一雪",text:"儿子的裤子坏了，我们给他买条新的吧。",tokens:["儿子","的","裤子","坏","了","我们","给","他","买","条","新","的","吧"]},{speaker:"王一雪",text:"旁边那个男孩儿就穿了这样的裤子，我觉得很好看啊！",tokens:["旁边","那个","男孩儿","就","穿","了","这样","的","裤子","我","觉得","很","好看","啊"]},{speaker:"刘明",text:"儿子的个子没有他那么高，穿上就不会太好看。",tokens:["儿子","的","个子","没有","他","那么","高","穿","上","就","不会","太","好看"]},{speaker:"王一雪",text:"你看这条黑色的怎么样？",tokens:["你","看","这","条","黑色","的","怎么样"]},{speaker:"刘明",text:"没有你上次买的那条好看。",tokens:["没有","你","上次","买","的","那","条","好看"]},{speaker:"王一雪",text:"好吧，我们再去那边看看。",tokens:["好","吧","我们","再","去","那边","看看"]}],note:"比较句（3）；动词“离”；时量补语（1）"},{n:2,title:"课文2",original:`王一雪：门口有家奶茶店。你想喝杯奶茶吗？
刘明：我想喝咖啡，我们去咖啡店吧。
王一雪：咖啡店离这儿有点儿远。
刘明：没关系，那家店的咖啡很好喝。
王一雪：那你等一下，我去买杯奶茶。
刘明：你不想喝咖啡吗？
王一雪：喝了咖啡，晚上就睡不着觉了。`,lines:[{name:"王一雪",zh:"门口有家奶茶店。你想喝杯奶茶吗？",py:"Ménkǒu yǒu jiā nǎichádiàn. Nǐ xiǎng hē bēi nǎichá ma?",en:"There's a milk tea shop at the entrance. Would you like a cup of milk tea?"},{name:"刘明",zh:"我想喝咖啡，我们去咖啡店吧。",py:"Wǒ xiǎng hē kāfēi, wǒmen qù kāfēidiàn ba.",en:"I'd like coffee—let's go to a coffee shop."},{name:"王一雪",zh:"咖啡店离这儿有点儿远。",py:"Kāfēidiàn lí zhèr yǒudiǎnr yuǎn.",en:"The coffee shop is a bit far from here."},{name:"刘明",zh:"没关系，那家店的咖啡很好喝。",py:"Méi guānxi, nà jiā diàn de kāfēi hěn hǎohē.",en:"It's fine—that shop's coffee is really good."},{name:"王一雪",zh:"那你等一下，我去买杯奶茶。",py:"Nà nǐ děng yíxià, wǒ qù mǎi bēi nǎichá.",en:"Then wait a sec—I'll go get a cup of milk tea."},{name:"刘明",zh:"你不想喝咖啡吗？",py:"Nǐ bù xiǎng hē kāfēi ma?",en:"Don't you want coffee?"},{name:"王一雪",zh:"喝了咖啡，晚上就睡不着觉了。",py:"Hē le kāfēi, wǎnshang jiù shuìbuzháo jiào le.",en:"If I drink coffee, I won't be able to sleep at night."}],vocab:{seg:[{t:"王一雪：门口有家"},{b:1},{t:`。你想喝杯奶茶吗？
刘明：我想喝咖啡，我们去`},{b:2},{t:`吧。
王一雪：咖啡店离这儿有点儿`},{b:3},{t:`。
刘明：没关系，那家店的咖啡很好喝。
王一雪：那你等一下，我去买杯奶茶。
刘明：你不想喝咖啡吗？
王一雪：喝了咖啡，晚上就睡不着觉了。`}],answers:["奶茶店","咖啡店","远"],tiles:{奶茶店:{py:"nǎichádiàn",en:"milk tea shop"},咖啡店:{py:"kāfēidiàn",en:"coffee shop"},远:{py:"yuǎn",en:"far away"}}},grammar:{before:`王一雪：门口有家奶茶店。你想喝杯奶茶吗？
刘明：我想喝咖啡，我们去咖啡店吧。
王一雪：`,after:`。
刘明：没关系，那家店的咖啡很好喝。
王一雪：那你等一下，我去买杯奶茶。
刘明：你不想喝咖啡吗？
王一雪：喝了咖啡，晚上就睡不着觉了。`,answer:"咖啡店离这儿有点儿远",tokens:["咖啡店","离","这儿","有点儿","远"]},sentences:[{speaker:"王一雪",text:"门口有家奶茶店。",tokens:["门口","有","家","奶茶店"]},{speaker:"刘明",text:"我想喝咖啡，我们去咖啡店吧。",tokens:["我","想","喝","咖啡","我们","去","咖啡店","吧"]},{speaker:"王一雪",text:"咖啡店离这儿有点儿远。",tokens:["咖啡店","离","这儿","有点儿","远"]},{speaker:"王一雪",text:"你想喝杯奶茶吗？",tokens:["你","想","喝","杯","奶茶","吗"]},{speaker:"刘明",text:"没关系，那家店的咖啡很好喝。",tokens:["没关系","那","家","店","的","咖啡","很","好","喝"]},{speaker:"王一雪",text:"那你等一下，我去买杯奶茶。",tokens:["那","你","等","一下","我","去","买","杯","奶茶"]},{speaker:"刘明",text:"你不想喝咖啡吗？",tokens:["你","不","想","喝","咖啡","吗"]},{speaker:"王一雪",text:"喝了咖啡，晚上就睡不着觉了。",tokens:["喝","了","咖啡","晚上","就","睡","不","着","觉","了"]}],note:"比较句（3）；动词“离”；时量补语（1）"},{n:3,title:"课文3",original:`刘明：我们打车回去吧。
王一雪：这里离家很近，还是走路吧。
刘明：要走多长时间？
王一雪：走半个多小时就到了。
刘明：好的。每天上下班都开车，今天运动运动吧。`,lines:[{name:"刘明",zh:"我们打车回去吧。",py:"Wǒmen dǎ chē huíqu ba.",en:"Let's take a taxi back."},{name:"王一雪",zh:"这里离家很近，还是走路吧。",py:"Zhèlǐ lí jiā hěn jìn, háishi zǒulù ba.",en:"Home is close from here—let's just walk."},{name:"刘明",zh:"要走多长时间？",py:"Yào zǒu duō cháng shíjiān?",en:"How long is the walk?"},{name:"王一雪",zh:"走半个多小时就到了。",py:"Zǒu bàn ge duō xiǎoshí jiù dào le.",en:"About half an hour on foot."},{name:"刘明",zh:"好的。每天上下班都开车，今天运动运动吧。",py:"Hǎo de. Měi tiān shàng-xiàbān dōu kāichē, jīntiān yùndòng yùndòng ba.",en:"Okay. We drive to and from work every day—let's get some exercise today."}],vocab:{seg:[{t:"刘明：我们"},{b:1},{t:`回去吧。
王一雪：这里离家很近，还是`},{b:2},{t:`吧。
刘明：要走多长时间？
王一雪：走半个多`},{b:3},{t:`就到了。
刘明：好的。每天上下班都开车，今天`},{b:4},{t:"运动吧。"}],answers:["打车","走路","小时","运动"],tiles:{打车:{py:"dǎchē",en:"to take/hail a taxi"},走路:{py:"zǒulù",en:"to walk"},小时:{py:"xiǎoshí",en:"hour"},运动:{py:"yùndòng",en:"sport; to exercise"}}},grammar:{before:`刘明：我们打车回去吧。
王一雪：这里离家很近，还是走路吧。
刘明：要走多长时间？
王一雪：`,after:`就到了。
刘明：好的。每天上下班都开车，今天运动运动吧。`,answer:"走半个多小时",tokens:["走","半个","多","小时"]},sentences:[{speaker:"刘明",text:"我们打车回去吧。",tokens:["我们","打车","回去","吧"]},{speaker:"王一雪",text:"这里离家很近，还是走路吧。",tokens:["这里","离","家","很","近","还是","走路","吧"]},{speaker:"王一雪",text:"走半个多小时就到了。",tokens:["走","半个","多","小时","就","到","了"]},{speaker:"刘明",text:"每天上下班都开车，今天运动运动吧。",tokens:["每天","上","下班","都","开车","今天","运动","运动","吧"]},{speaker:"刘明",text:"要走多长时间？",tokens:["要","走","多","长","时间"]},{speaker:"刘明",text:"好的。",tokens:["好","的"]}],note:"比较句（3）；动词“离”；时量补语（1）"},{n:4,title:"课文4",original:"这周刘明休息，我下班后跟他去了一家商店。商店里边的衣服没有大商场里的好看。我们没有买到喜欢的衣服，从商店出来就到咖啡店坐了坐。因为想运动运动，所以喝完东西，我们就走回家了。",lines:[{name:"",zh:"这周刘明休息，我下班后跟他去了一家商店。商店里边的衣服没有大商场里的好看。我们没有买到喜欢的衣服，从商店出来就到咖啡店坐了坐。因为想运动运动，所以喝完东西，我们就走回家了。",py:"Zhè zhōu Liú Míng xiūxi, wǒ xiàbān hòu gēn tā qù le yì jiā shāngdiàn. Shāngdiàn lǐbian de yīfu méiyǒu dà shāngchǎng li de hǎokàn. Wǒmen méiyǒu mǎidào xǐhuan de yīfu, cóng shāngdiàn chūlai jiù dào kāfēidiàn zuò le zuò. Yīnwèi xiǎng yùndòng yùndòng, suǒyǐ hē wán dōngxi, wǒmen jiù zǒu huí jiā le.",en:"Liu Ming was off this week, so after work I went with him to a store. The clothes in the store weren't as nice as those in a big mall. We didn't find any clothes we liked, so after leaving we sat for a while at a coffee shop. Because we wanted some exercise, after our drinks we walked home."}],vocab:{seg:[{t:"这周刘明休息，我下班后跟他去了一家"},{b:1},{t:"。商店里边的衣服没有大商场里的好看。我们没有买到喜欢的衣服，从商店出来就到"},{b:2},{t:"坐了坐。因为想"},{b:3},{t:"运动，所以喝完东西，我们就走回家了。"}],answers:["商店","咖啡店","运动"],tiles:{商店:{py:"shāngdiàn",en:"shop; store"},咖啡店:{py:"kāfēidiàn",en:"coffee shop"},运动:{py:"yùndòng",en:"sport; to exercise"}}},grammar:{before:"这周刘明休息，我下班后跟他去了一家商店。",after:"。我们没有买到喜欢的衣服，从商店出来就到咖啡店坐了坐。因为想运动运动，所以喝完东西，我们就走回家了。",answer:"商店里边的衣服没有大商场里的好看",tokens:["商店","里边","的","衣服","没有","大","商场","里","的","好看"]},sentences:[{speaker:"",text:"这周刘明休息，我下班后跟他去了一家商店。",tokens:["这","周","刘","明","休息","我","下班","后","跟","他","去","了","一家","商店"]},{speaker:"",text:"商店里边的衣服没有大商场里的好看。",tokens:["商店","里边","的","衣服","没有","大","商场","里","的","好看"]},{speaker:"",text:"因为想运动运动，所以喝完东西，我们就走回家了。",tokens:["因为","想","运动","运动","所以","喝","完","东西","我们","就","走","回家","了"]}],note:"比较句（3）；动词“离”；时量补语（1）"}]},{num:10,name:"就要考试了",texts:[{n:1,title:"课文1",original:`刘明：小明，你们明天开学，你准备好了吗？
刘小明：明天就开学啊？爸爸，我的书包你看见了吗？
刘明：书包在门后面。
刘小明：书在哪儿呢？笔呢？
刘明：书在床上，笔在桌子上。
刘小明：太好了！现在都准备好了。
刘明：这次爸爸帮你，下次你自己准备，好不好？
刘小明：好！`,lines:[{name:"刘明",zh:"小明，你们明天开学，你准备好了吗？",py:"Xiǎo Míng, nǐmen míngtiān kāixué, nǐ zhǔnbèi hǎo le ma?",en:"Xiao Ming, school starts tomorrow—are you ready?"},{name:"刘小明",zh:"明天就开学啊？爸爸，我的书包你看见了吗？",py:"Míngtiān jiù kāixué a? Bàba, wǒ de shūbāo nǐ kànjiàn le ma?",en:"School starts tomorrow already? Dad, have you seen my schoolbag?"},{name:"刘明",zh:"书包在门后面。",py:"Shūbāo zài mén hòumiàn.",en:"The schoolbag is behind the door."},{name:"刘小明",zh:"书在哪儿呢？笔呢？",py:"Shū zài nǎr ne? Bǐ ne?",en:"Where are my books? And my pens?"},{name:"刘明",zh:"书在床上，笔在桌子上。",py:"Shū zài chuáng shàng, bǐ zài zhuōzi shàng.",en:"The books are on the bed, and the pens are on the desk."},{name:"刘小明",zh:"太好了！现在都准备好了。",py:"Tài hǎo le! Xiànzài dōu zhǔnbèi hǎo le.",en:"Great! Everything's ready now."},{name:"刘明",zh:"这次爸爸帮你，下次你自己准备，好不好？",py:"Zhè cì bàba bāng nǐ, xià cì nǐ zìjǐ zhǔnbèi, hǎo bu hǎo?",en:"This time Dad helped you; next time you prepare it yourself, okay?"},{name:"刘小明",zh:"好！",py:"Hǎo!",en:"Okay!"}],vocab:{seg:[{t:"刘明：小明，你们明天"},{b:1},{t:`，你准备好了吗？
刘小明：明天就开学啊？爸爸，我的`},{b:2},{t:`你看见了吗？
刘明：书包在门后面。
刘小明：书在哪儿呢？笔呢？
刘明：书在`},{b:3},{t:"上，笔在"},{b:4},{t:`上。
刘小明：太好了！现在都准备好了。
刘明：这次爸爸帮你，下次你自己准备，好不好？
刘小明：好！`}],answers:["开学","书包","床","桌子"],tiles:{开学:{py:"kāixué",en:"school begins"},书包:{py:"shūbāo",en:"schoolbag"},床:{py:"chuáng",en:"bed"},桌子:{py:"zhuōzi",en:"table; desk"}}},grammar:{before:`刘明：小明，你们明天开学，你准备好了吗？
刘小明：明天就开学啊？爸爸，`,after:`？
刘明：书包在门后面。
刘小明：书在哪儿呢？笔呢？
刘明：书在床上，笔在桌子上。
刘小明：太好了！现在都准备好了。
刘明：这次爸爸帮你，下次你自己准备，好不好？
刘小明：好！`,answer:"我的书包你看见了吗",tokens:["我","的","书包","你","看见","了","吗"]},sentences:[{speaker:"刘明",text:"小明，你们明天开学，你准备好了吗？",tokens:["小","明","你们","明天","开学","你","准备","好","了","吗"]},{speaker:"刘小明",text:"明天就开学啊？",tokens:["明天","就","开学","啊"]},{speaker:"刘小明",text:"爸爸，我的书包你看见了吗？",tokens:["爸爸","我","的","书包","你","看见","了","吗"]},{speaker:"刘明",text:"书包在门后面。",tokens:["书包","在","门","后面"]},{speaker:"刘明",text:"书在床上，笔在桌子上。",tokens:["书","在","床","上","笔","在","桌子","上"]},{speaker:"刘小明",text:"书在哪儿呢？",tokens:["书","在","哪儿","呢"]},{speaker:"刘小明",text:"笔呢？",tokens:["笔","呢"]},{speaker:"刘小明",text:"太好了！",tokens:["太","好","了"]},{speaker:"刘小明",text:"现在都准备好了。",tokens:["现在","都","准备","好","了"]},{speaker:"刘明",text:"这次爸爸帮你，下次你自己准备，好不好？",tokens:["这","次","爸爸","帮","你","下次","你","自己","准备","好","不","好"]}],note:"主谓谓语句；选择问句；固定格式“要/快/快要/就要……了”"},{n:2,title:"课文2",original:`王一雪：小雪，你在做什么呢？
刘小雪：明天就要考试了，我在看书。
王一雪：这些词要好好看看。
刘小雪：我看过了，意思也都懂了。
王一雪：你的本子呢？本子上做错的题也要看一看。
刘小雪：妈妈，是您准备考试还是我准备考试？`,lines:[{name:"王一雪",zh:"小雪，你在做什么呢？",py:"Xiǎoxuě, nǐ zài zuò shénme ne?",en:"Xiaoxue, what are you doing?"},{name:"刘小雪",zh:"明天就要考试了，我在看书。",py:"Míngtiān jiù yào kǎoshì le, wǒ zài kàn shū.",en:"There's an exam tomorrow, so I'm studying."},{name:"王一雪",zh:"这些词要好好看看。",py:"Zhèxiē cí yào hǎohǎo kànkan.",en:"Study these words carefully."},{name:"刘小雪",zh:"我看过了，意思也都懂了。",py:"Wǒ kànguo le, yìsi yě dōu dǒng le.",en:"I've gone over them and understand all the meanings."},{name:"王一雪",zh:"你的本子呢？本子上做错的题也要看一看。",py:"Nǐ de běnzi ne? Běnzi shàng zuòcuò de tí yě yào kàn yi kàn.",en:"Where's your notebook? Look over the questions you got wrong in it too."},{name:"刘小雪",zh:"妈妈，是您准备考试还是我准备考试？",py:"Māma, shì nín zhǔnbèi kǎoshì háishi wǒ zhǔnbèi kǎoshì?",en:"Mom, is it you taking the exam or me?"}],vocab:{seg:[{t:`王一雪：小雪，你在做什么呢？
刘小雪：明天就要`},{b:1},{t:`了，我在看书。
王一雪：这些词要好好看看。
刘小雪：我看过了，`},{b:2},{t:`也都懂了。
王一雪：你的本子呢？本子上`},{b:3},{t:"的"},{b:4},{t:`也要看一看。
刘小雪：妈妈，是您准备考试还是我准备考试？`}],answers:["考试","意思","做错","题"],tiles:{考试:{py:"kǎoshì",en:"to take an exam; exam"},意思:{py:"yìsi",en:"meaning; idea"},做错:{py:"zuòcuò",en:"to do (sth) wrong"},题:{py:"tí",en:"question; problem"}}},grammar:{before:`王一雪：小雪，你在做什么呢？
刘小雪：`,after:`，我在看书。
王一雪：这些词要好好看看。
刘小雪：我看过了，意思也都懂了。
王一雪：你的本子呢？本子上做错的题也要看一看。
刘小雪：妈妈，是您准备考试还是我准备考试？`,answer:"明天就要考试了",tokens:["明天","就要","考试","了"]},sentences:[{speaker:"刘小雪",text:"明天就要考试了，我在看书。",tokens:["明天","就要","考试","了","我","在","看书"]},{speaker:"刘小雪",text:"我看过了，意思也都懂了。",tokens:["我","看过","了","意思","也","都","懂","了"]},{speaker:"王一雪",text:"本子上做错的题也要看一看。",tokens:["本子","上","做错","的","题","也","要","看","一","看"]},{speaker:"刘小雪",text:"妈妈，是您准备考试还是我准备考试？",tokens:["妈妈","是","您","准备","考试","还是","我","准备","考试"]},{speaker:"王一雪",text:"小雪，你在做什么呢？",tokens:["小雪","你","在","做","什么","呢"]},{speaker:"王一雪",text:"这些词要好好看看。",tokens:["这些","词","要","好好","看看"]},{speaker:"王一雪",text:"你的本子呢？",tokens:["你","的","本子","呢"]}],note:"主谓谓语句；选择问句；固定格式“要/快/快要/就要……了”"},{n:3,title:"课文3",original:`刘小雪：妈妈，我回来了！
王一雪：我买了奶茶，就在桌子上，自己去拿吧。
刘小雪：谢谢妈妈！
王一雪：今天考试考得怎么样？
刘小雪：我觉得比上次好。
王一雪：真不错！饭菜快要做好了，你叫弟弟一起去洗手吧。
刘小明：妈妈，我是第一名，姐姐还没洗完呢。
王一雪：你洗得真快啊！`,lines:[{name:"刘小雪",zh:"妈妈，我回来了！",py:"Māma, wǒ huílai le!",en:"Mom, I'm home!"},{name:"王一雪",zh:"我买了奶茶，就在桌子上，自己去拿吧。",py:"Wǒ mǎi le nǎichá, jiù zài zhuōzi shàng, zìjǐ qù ná ba.",en:"I bought milk tea—it's on the table, go help yourself."},{name:"刘小雪",zh:"谢谢妈妈！",py:"Xièxie māma!",en:"Thanks, Mom!"},{name:"王一雪",zh:"今天考试考得怎么样？",py:"Jīntiān kǎoshì kǎo de zěnmeyàng?",en:"How did the exam go today?"},{name:"刘小雪",zh:"我觉得比上次好。",py:"Wǒ juéde bǐ shàng cì hǎo.",en:"I think it went better than last time."},{name:"王一雪",zh:"真不错！饭菜快要做好了，你叫弟弟一起去洗手吧。",py:"Zhēn búcuò! Fàncài kuài yào zuò hǎo le, nǐ jiào dìdi yìqǐ qù xǐ shǒu ba.",en:"Great! Dinner's almost ready—go call your little brother to wash hands with you."},{name:"刘小明",zh:"妈妈，我是第一名，姐姐还没洗完呢。",py:"Māma, wǒ shì dì-yī míng, jiějie hái méi xǐ wán ne.",en:"Mom, I'm first—big sister hasn't finished washing yet."},{name:"王一雪",zh:"你洗得真快啊！",py:"Nǐ xǐ de zhēn kuài a!",en:"You washed up really fast!"}],vocab:{seg:[{t:`刘小雪：妈妈，我回来了！
王一雪：我买了`},{b:1},{t:`，就在桌子上，自己去拿吧。
刘小雪：谢谢妈妈！
王一雪：今天`},{b:2},{t:`考得怎么样？
刘小雪：我觉得比上次好。
王一雪：真不错！饭菜快要做好了，你叫弟弟一起去洗手吧。
刘小明：妈妈，我是`},{b:3},{t:"，姐姐还没"},{b:4},{t:`呢。
王一雪：你洗得真快啊！`}],answers:["奶茶","考试","第一名","洗完"],tiles:{奶茶:{py:"nǎichá",en:"bubble tea"},考试:{py:"kǎoshì",en:"to take an exam; exam"},第一名:{py:"dì-yī míng",en:"first place"},洗完:{py:"xǐ wán",en:"to finish washing"}}},grammar:{before:`刘小雪：妈妈，我回来了！
王一雪：我买了奶茶，就在桌子上，自己去拿吧。
刘小雪：谢谢妈妈！
王一雪：今天考试考得怎么样？
刘小雪：我觉得比上次好。
王一雪：真不错！`,after:`，你叫弟弟一起去洗手吧。
刘小明：妈妈，我是第一名，姐姐还没洗完呢。
王一雪：你洗得真快啊！`,answer:"饭菜快要做好了",tokens:["饭菜","快要","做好","了"]},sentences:[{speaker:"王一雪",text:"我买了奶茶，就在桌子上，自己去拿吧。",tokens:["我","买","了","奶茶","就","在","桌子","上","自己","去","拿","吧"]},{speaker:"王一雪",text:"今天考试考得怎么样？",tokens:["今天","考试","考","得","怎么样"]},{speaker:"刘小明",text:"妈妈，我是第一名，姐姐还没洗完呢。",tokens:["妈妈","我","是","第一名","姐姐","还","没","洗完","呢"]},{speaker:"刘小雪",text:"妈妈，我回来了！",tokens:["妈妈","我","回来","了"]},{speaker:"刘小雪",text:"谢谢妈妈！",tokens:["谢谢","妈妈"]},{speaker:"刘小雪",text:"我觉得比上次好。",tokens:["我","觉得","比","上次","好"]},{speaker:"王一雪",text:"真不错！",tokens:["真","不错"]},{speaker:"王一雪",text:"饭菜快要做好了，你叫弟弟一起去洗手吧。",tokens:["饭菜","快要","做好","了","你","叫","弟弟","一起","去","洗","手","吧"]},{speaker:"王一雪",text:"你洗得真快啊！",tokens:["你","洗","得","真","快","啊"]}],note:"主谓谓语句；选择问句；固定格式“要/快/快要/就要……了”"},{n:4,title:"课文4",original:"快要开学了，爸爸帮弟弟准备书包、本子和笔。我就要考试了，妈妈让我看书、看做错的题。我们上学，爸爸、妈妈比我们还忙。我问他们：“是我和弟弟上学还是你们上学？”我问完，他们都笑了。",lines:[{name:"",zh:"快要开学了，爸爸帮弟弟准备书包、本子和笔。我就要考试了，妈妈让我看书、看做错的题。我们上学，爸爸、妈妈比我们还忙。我问他们：“是我和弟弟上学还是你们上学？”我问完，他们都笑了。",py:'Kuài yào kāixué le, bàba bāng dìdi zhǔnbèi shūbāo, běnzi hé bǐ. Wǒ jiù yào kǎoshì le, māma ràng wǒ kàn shū, kàn zuòcuò de tí. Wǒmen shàngxué, bàba, māma bǐ wǒmen hái máng. Wǒ wèn tāmen: "shì wǒ hé dìdi shàngxué háishi nǐmen shàngxué?" Wǒ wèn wán, tāmen dōu xiào le.',en:`School's about to start, and Dad is helping my little brother pack his schoolbag, notebooks, and pens. I have an exam coming up, and Mom has me study and review the questions I got wrong. When we go to school, Mom and Dad are even busier than we are. I asked them, "Is it my brother and me going to school, or you two?" After I asked, they both laughed.`}],vocab:{seg:[{t:"快要"},{b:1},{t:"了，爸爸帮弟弟准备"},{b:2},{t:"、本子和笔。我就要"},{b:3},{t:"了，妈妈让我看书、看做错的题。我们上学，爸爸、妈妈比我们还忙。我问他们：“是我和弟弟上学还是你们上学？”我问完，他们都笑了。"}],answers:["开学","书包","考试"],tiles:{开学:{py:"kāixué",en:"school begins"},书包:{py:"shūbāo",en:"schoolbag"},考试:{py:"kǎoshì",en:"to take an exam; exam"}}},grammar:{before:"",after:"，爸爸帮弟弟准备书包、本子和笔。我就要考试了，妈妈让我看书、看做错的题。我们上学，爸爸、妈妈比我们还忙。我问他们：“是我和弟弟上学还是你们上学？”我问完，他们都笑了。",answer:"快要开学了",tokens:["快要","开学","了"]},sentences:[{speaker:"",text:"快要开学了，爸爸帮弟弟准备书包、本子和笔。",tokens:["快要","开学","了","爸爸","帮","弟弟","准备","书包","本子","和","笔"]},{speaker:"",text:"我就要考试了，妈妈让我看书、看做错的题。",tokens:["我","就要","考试","了","妈妈","让","我","看书","看","做","错","的","题"]},{speaker:"",text:"我们上学，爸爸、妈妈比我们还忙。",tokens:["我们","上学","爸爸","妈妈","比","我们","还","忙"]},{speaker:"",text:"我问他们：“是我和弟弟上学还是你们上学？”",tokens:["我","问","他们","“","是","我","和","弟弟","上学","还是","你们","上学","”"]},{speaker:"",text:"我问完，他们都笑了。",tokens:["我","问","完","他们","都","笑","了"]}],note:"主谓谓语句；选择问句；固定格式“要/快/快要/就要……了”"}]},{num:11,name:"我最喜欢吃中国菜",texts:[{n:1,title:"课文1",original:`王一飞：家月，都下课了，你怎么还不回家？
白家月：我头疼，不太舒服。
王一飞：你这几天经常头疼，去医院看看吧。
白家月：我想休息一下，现在不能动，一动就疼。
王一飞：那你在这儿坐着，我去开车，一会儿送你去医院。
白家月：谢谢王老师。`,lines:[{name:"王一飞",zh:"家月，都下课了，你怎么还不回家？",py:"Jiāyuè, dōu xiàkè le, nǐ zěnme hái bù huí jiā?",en:"Jiayue, class is over—why aren't you going home yet?"},{name:"白家月",zh:"我头疼，不太舒服。",py:"Wǒ tóu téng, bú tài shūfu.",en:"I have a headache and don't feel well."},{name:"王一飞",zh:"你这几天经常头疼，去医院看看吧。",py:"Nǐ zhè jǐ tiān jīngcháng tóu téng, qù yīyuàn kànkan ba.",en:"You've had headaches often these days—go see a doctor."},{name:"白家月",zh:"我想休息一下，现在不能动，一动就疼。",py:"Wǒ xiǎng xiūxi yíxià, xiànzài bù néng dòng, yí dòng jiù téng.",en:"I want to rest—I can't move now; it hurts the moment I do."},{name:"王一飞",zh:"那你在这儿坐着，我去开车，一会儿送你去医院。",py:"Nà nǐ zài zhèr zuòzhe, wǒ qù kāichē, yíhuìr sòng nǐ qù yīyuàn.",en:"Then sit here—I'll get the car and take you to the hospital in a bit."},{name:"白家月",zh:"谢谢王老师。",py:"Xièxie Wáng lǎoshī.",en:"Thank you, Teacher Wang."}],vocab:{seg:[{t:`王一飞：家月，都下课了，你怎么还不回家？
白家月：我`},{b:1},{t:`，不太舒服。
王一飞：你这几天经常头疼，去`},{b:2},{t:`看看吧。
白家月：我想`},{b:3},{t:`一下，现在不能动，一动就疼。
王一飞：那你在这儿坐着，我去开车，一会儿送你去医院。
白家月：谢谢王老师。`}],answers:["头疼","医院","休息"],tiles:{头疼:{py:"tóu téng",en:"headache; to have a headache"},医院:{py:"yīyuàn",en:"hospital"},休息:{py:"xiūxi",en:"to rest"}}},grammar:{before:`王一飞：家月，都下课了，你怎么还不回家？
白家月：我头疼，不太舒服。
王一飞：你这几天经常头疼，去医院看看吧。
白家月：我想休息一下，现在不能动，一动就疼。
王一飞：那`,after:`，我去开车，一会儿送你去医院。
白家月：谢谢王老师。`,answer:"你在这儿坐着",tokens:["你","在","这儿","坐","着"]},sentences:[{speaker:"白家月",text:"我头疼，不太舒服。",tokens:["我","头疼","不太","舒服"]},{speaker:"王一飞",text:"你这几天经常头疼，去医院看看吧。",tokens:["你","这","几天","经常","头疼","去","医院","看看","吧"]},{speaker:"白家月",text:"我想休息一下，现在不能动，一动就疼。",tokens:["我","想","休息","一下","现在","不能","动","一","动","就","疼"]},{speaker:"王一飞",text:"那你在这儿坐着，我去开车，一会儿送你去医院。",tokens:["那","你","在","这儿","坐","着","我","去","开车","一会儿","送","你","去","医院"]},{speaker:"王一飞",text:"家月，都下课了，你怎么还不回家？",tokens:["家","月","都","下课","了","你","怎么","还","不","回家"]},{speaker:"白家月",text:"谢谢王老师。",tokens:["谢谢","王老师"]}],note:"动态助词“着”（1）；动态助词“着”（2）；程度副词“最”"},{n:2,title:"课文2",original:`王一飞：现在路上车多，还下着雪，我开慢一点儿。
白家月：没问题，现在头没那么疼了。
王一飞：好。李文来电话了，你帮我接一下。
白家月：喂，李文，王老师开着车呢，你找她有事吗？
李文：没什么事。今天雪这么大，你们开车去哪儿啊？
白家月：去医院，我头有点儿疼。
李文：那我一会儿去看看你。`,lines:[{name:"王一飞",zh:"现在路上车多，还下着雪，我开慢一点儿。",py:"Xiànzài lù shàng chē duō, hái xiàzhe xuě, wǒ kāi màn yìdiǎnr.",en:"There's heavy traffic now and it's snowing, so I'll drive slowly."},{name:"白家月",zh:"没问题，现在头没那么疼了。",py:"Méi wèntí, xiànzài tóu méi nàme téng le.",en:"No problem—my head doesn't hurt as much now."},{name:"王一飞",zh:"好。李文来电话了，你帮我接一下。",py:"Hǎo. Lǐ Wén lái diànhuà le, nǐ bāng wǒ jiē yíxià.",en:"Okay. Li Wen is calling—answer it for me."},{name:"白家月",zh:"喂，李文，王老师开着车呢，你找她有事吗？",py:"Wéi, Lǐ Wén, Wáng lǎoshī kāizhe chē ne, nǐ zhǎo tā yǒu shì ma?",en:"Hello, Li Wen, Teacher Wang is driving—did you need her for something?"},{name:"李文",zh:"没什么事。今天雪这么大，你们开车去哪儿啊？",py:"Méi shénme shì. Jīntiān xuě zhème dà, nǐmen kāichē qù nǎr a?",en:"Nothing much. The snow's so heavy today—where are you two driving to?"},{name:"白家月",zh:"去医院，我头有点儿疼。",py:"Qù yīyuàn, wǒ tóu yǒudiǎnr téng.",en:"To the hospital—I have a bit of a headache."},{name:"李文",zh:"那我一会儿去看看你。",py:"Nà wǒ yíhuìr qù kànkan nǐ.",en:"Then I'll come see you in a bit."}],vocab:{seg:[{t:"王一飞：现在路上车多，还下着"},{b:1},{t:`，我开慢一点儿。
白家月：没问题，现在头没那么疼了。
王一飞：好。李文来电话了，你帮我`},{b:2},{t:`一下。
白家月：喂，李文，王老师开着车呢，你找她有事吗？
李文：没什么事。今天雪这么大，你们开车去哪儿啊？
白家月：去`},{b:3},{t:`，我头有点儿疼。
李文：那我一会儿去看看你。`}],answers:["雪","接","医院"],tiles:{雪:{py:"xuě",en:"snow"},接:{py:"jiē",en:"to receive; to pick up"},医院:{py:"yīyuàn",en:"hospital"}}},grammar:{before:"王一飞：现在路上车多，",after:`，我开慢一点儿。
白家月：没问题，现在头没那么疼了。
王一飞：好。李文来电话了，你帮我接一下。
白家月：喂，李文，王老师开着车呢，你找她有事吗？
李文：没什么事。今天雪这么大，你们开车去哪儿啊？
白家月：去医院，我头有点儿疼。
李文：那我一会儿去看看你。`,answer:"还下着雪",tokens:["还","下","着","雪"]},sentences:[{speaker:"王一飞",text:"现在路上车多，还下着雪，我开慢一点儿。",tokens:["现在","路上","车","多","还","下","着","雪","我","开","慢","一点儿"]},{speaker:"王一飞",text:"李文来电话了，你帮我接一下。",tokens:["李文","来","电话","了","你","帮","我","接","一下"]},{speaker:"李文",text:"今天雪这么大，你们开车去哪儿啊？",tokens:["今天","雪","这么","大","你们","开车","去","哪儿","啊"]},{speaker:"白家月",text:"去医院，我头有点儿疼。",tokens:["去","医院","我","头","有点儿","疼"]},{speaker:"白家月",text:"没问题，现在头没那么疼了。",tokens:["没问题","现在","头","没","那么","疼","了"]},{speaker:"白家月",text:"喂，李文，王老师开着车呢，你找她有事吗？",tokens:["喂","李文","王老师","开","着","车","呢","你","找","她","有","事","吗"]},{speaker:"李文",text:"没什么事。",tokens:["没什么","事"]},{speaker:"李文",text:"那我一会儿去看看你。",tokens:["那","我","一会儿","去","看看","你"]}],note:"动态助词“着”（1）；动态助词“着”（2）；程度副词“最”"},{n:3,title:"课文3",original:`白家月：李文，快请进！
李文：家月，你怎么样了？头还疼吗？
白家月：不那么疼了。医生开了一些药，吃完就好多了。
李文：那就好！
王一飞：家月，你想不想吃点儿东西？
李文：吃点儿吧，身体不舒服时更要好好吃饭。
白家月：吃点儿什么呢？
王一飞：你最喜欢吃中国菜，我做几个中国菜吧。
白家月：好的，谢谢王老师。`,lines:[{name:"白家月",zh:"李文，快请进！",py:"Lǐ Wén, kuài qǐng jìn!",en:"Li Wen, come in!"},{name:"李文",zh:"家月，你怎么样了？头还疼吗？",py:"Jiāyuè, nǐ zěnmeyàng le? Tóu hái téng ma?",en:"Jiayue, how are you? Does your head still hurt?"},{name:"白家月",zh:"不那么疼了。医生开了一些药，吃完就好多了。",py:"Bú nàme téng le. Yīshēng kāi le yìxiē yào, chī wán jiù hǎo duō le.",en:"Not as much. The doctor prescribed some medicine, and after taking it I feel much better."},{name:"李文",zh:"那就好！",py:"Nà jiù hǎo!",en:"That's good!"},{name:"王一飞",zh:"家月，你想不想吃点儿东西？",py:"Jiāyuè, nǐ xiǎng bu xiǎng chī diǎnr dōngxi?",en:"Jiayue, would you like something to eat?"},{name:"李文",zh:"吃点儿吧，身体不舒服时更要好好吃饭。",py:"Chī diǎnr ba, shēntǐ bù shūfu shí gèng yào hǎohǎo chī fàn.",en:"Have a little—when you're unwell you should eat properly all the more."},{name:"白家月",zh:"吃点儿什么呢？",py:"Chī diǎnr shénme ne?",en:"What should I eat?"},{name:"王一飞",zh:"你最喜欢吃中国菜，我做几个中国菜吧。",py:"Nǐ zuì xǐhuan chī Zhōngguó cài, wǒ zuò jǐ ge Zhōngguó cài ba.",en:"You love Chinese food most—I'll cook a few Chinese dishes."},{name:"白家月",zh:"好的，谢谢王老师。",py:"Hǎo de, xièxie Wáng lǎoshī.",en:"Okay, thank you, Teacher Wang."}],vocab:{seg:[{t:`白家月：李文，快请进！
李文：家月，你怎么样了？头还疼吗？
白家月：不那么疼了。医生开了一些`},{b:1},{t:`，吃完就好多了。
李文：那就好！
王一飞：家月，你想不想吃点儿东西？
李文：吃点儿吧，`},{b:2},{t:`不舒服时更要好好吃饭。
白家月：吃点儿什么呢？
王一飞：你`},{b:3},{t:"喜欢吃"},{b:4},{t:`，我做几个中国菜吧。
白家月：好的，谢谢王老师。`}],answers:["药","身体","最","中国菜"],tiles:{药:{py:"yào",en:"medicine"},身体:{py:"shēntǐ",en:"body; health"},最:{py:"zuì",en:"most"},中国菜:{py:"Zhōngguó cài",en:"Chinese food"}}},grammar:{before:`白家月：李文，快请进！
李文：家月，你怎么样了？头还疼吗？
白家月：不那么疼了。医生开了一些药，吃完就好多了。
李文：那就好！
王一飞：家月，你想不想吃点儿东西？
李文：吃点儿吧，身体不舒服时更要好好吃饭。
白家月：吃点儿什么呢？
王一飞：`,after:`，我做几个中国菜吧。
白家月：好的，谢谢王老师。`,answer:"你最喜欢吃中国菜",tokens:["你","最","喜欢","吃","中国","菜"]},sentences:[{speaker:"白家月",text:"医生开了一些药，吃完就好多了。",tokens:["医生","开","了","一些","药","吃","完","就","好多","了"]},{speaker:"李文",text:"吃点儿吧，身体不舒服时更要好好吃饭。",tokens:["吃","点儿","吧","身体","不","舒服","时","更","要","好好","吃饭"]},{speaker:"王一飞",text:"你最喜欢吃中国菜，我做几个中国菜吧。",tokens:["你","最","喜欢","吃","中国菜","我","做","几","个","中国菜","吧"]},{speaker:"白家月",text:"李文，快请进！",tokens:["李文","快","请","进"]},{speaker:"李文",text:"家月，你怎么样了？",tokens:["家","月","你","怎么样","了"]},{speaker:"李文",text:"头还疼吗？",tokens:["头","还","疼","吗"]},{speaker:"白家月",text:"不那么疼了。",tokens:["不","那么","疼","了"]},{speaker:"李文",text:"那就好！",tokens:["那","就","好"]},{speaker:"王一飞",text:"家月，你想不想吃点儿东西？",tokens:["家","月","你","想","不","想","吃","点儿","东西"]},{speaker:"白家月",text:"吃点儿什么呢？",tokens:["吃","点儿","什么","呢"]},{speaker:"白家月",text:"好的，谢谢王老师。",tokens:["好","的","谢谢","王老师"]}],note:"动态助词“着”（1）；动态助词“着”（2）；程度副词“最”"},{n:4,title:"课文4",original:"我这几天经常头疼，从药店买了点儿药，没去医院。今天下课后，王老师看我不舒服，就送我去医院了。从医院回来，李文也来看我了。现在他们都回去了，我也要睡觉了。",lines:[{name:"",zh:"我这几天经常头疼，从药店买了点儿药，没去医院。今天下课后，王老师看我不舒服，就送我去医院了。从医院回来，李文也来看我了。现在他们都回去了，我也要睡觉了。",py:"Wǒ zhè jǐ tiān jīngcháng tóu téng, cóng yàodiàn mǎi le diǎnr yào, méi qù yīyuàn. Jīntiān xiàkè hòu, Wáng lǎoshī kàn wǒ bù shūfu, jiù sòng wǒ qù yīyuàn le. Cóng yīyuàn huílai, Lǐ Wén yě lái kàn wǒ le. Xiànzài tāmen dōu huíqu le, wǒ yě yào shuìjiào le.",en:"I've had frequent headaches these days; I bought some medicine at the pharmacy and didn't go to the hospital. After class today, Teacher Wang saw I was unwell and took me to the hospital. After I got back, Li Wen came to see me too. Now they've all left, and I'm going to sleep."}],vocab:{seg:[{t:"我这几天经常"},{b:1},{t:"，从"},{b:2},{t:"买了点儿药，没去"},{b:3},{t:"。今天下课后，王老师看我不舒服，就送我去医院了。从医院回来，李文也来看我了。现在他们都回去了，我也要"},{b:4},{t:"了。"}],answers:["头疼","药店","医院","睡觉"],tiles:{头疼:{py:"tóu téng",en:"headache; to have a headache"},药店:{py:"yàodiàn",en:"pharmacy"},医院:{py:"yīyuàn",en:"hospital"},睡觉:{py:"shuìjiào",en:"to sleep; go to bed"}}},grammar:{before:"我这几天经常头疼，从药店买了点儿药，没去医院。今天下课后，王老师看我不舒服，就送我去医院了。从医院回来，李文也来看我了。现在他们都回去了，",after:"。",answer:"我也要睡觉了",tokens:["我","也","要","睡觉","了"]},sentences:[{speaker:"",text:"我这几天经常头疼，从药店买了点儿药，没去医院。",tokens:["我","这","几天","经常","头疼","从","药店","买","了","点儿","药","没","去","医院"]},{speaker:"",text:"今天下课后，王老师看我不舒服，就送我去医院了。",tokens:["今天","下课","后","王老师","看","我","不","舒服","就","送","我","去","医院","了"]},{speaker:"",text:"从医院回来，李文也来看我了。",tokens:["从","医院","回来","李文","也","来","看","我","了"]},{speaker:"",text:"现在他们都回去了，我也要睡觉了。",tokens:["现在","他们","都","回去","了","我","也","要","睡觉","了"]}],note:"动态助词“着”（1）；动态助词“着”（2）；程度副词“最”"}]},{num:12,name:"这里比北京冷多了",texts:[{n:1,title:"课文1",original:`王一雪：喂，家月，是你啊！有什么事情吗？
白家月：没什么事，就想跟您说说话。
王一雪：好啊。你今天没课吗？
白家月：下午有课。您那里天气怎么样？
王一雪：北京这几天虽然是晴天，但是有点儿冷。
白家月：我这里比北京冷多了，外边还正下着雪呢！`,lines:[{name:"王一雪",zh:"喂，家月，是你啊！有什么事情吗？",py:"Wéi, Jiāyuè, shì nǐ a! Yǒu shénme shìqing ma?",en:"Hello, Jiayue, it's you! Is something up?"},{name:"白家月",zh:"没什么事，就想跟您说说话。",py:"Méi shénme shì, jiù xiǎng gēn nín shuōshuo huà.",en:"Nothing much—I just wanted to chat with you."},{name:"王一雪",zh:"好啊。你今天没课吗？",py:"Hǎo a. Nǐ jīntiān méi kè ma?",en:"Sure. Don't you have class today?"},{name:"白家月",zh:"下午有课。您那里天气怎么样？",py:"Xiàwǔ yǒu kè. Nín nàli tiānqì zěnmeyàng?",en:"I have class in the afternoon. How's the weather where you are?"},{name:"王一雪",zh:"北京这几天虽然是晴天，但是有点儿冷。",py:"Běijīng zhè jǐ tiān suīrán shì qíngtiān, dànshì yǒudiǎnr lěng.",en:"Beijing has been sunny these days, but a bit cold."},{name:"白家月",zh:"我这里比北京冷多了，外边还正下着雪呢！",py:"Wǒ zhèlǐ bǐ Běijīng lěng duō le, wàibian hái zhèng xiàzhe xuě ne!",en:"It's much colder here than in Beijing—it's even snowing outside right now!"}],vocab:{seg:[{t:`王一雪：喂，家月，是你啊！有什么事情吗？
白家月：没什么事，就想跟您说说话。
王一雪：好啊。你今天没课吗？
白家月：下午有课。您那里`},{b:1},{t:`怎么样？
王一雪：北京这几天虽然是`},{b:2},{t:"，但是有点儿"},{b:3},{t:`。
白家月：我这里比北京冷多了，外边还正下着`},{b:4},{t:"呢！"}],answers:["天气","晴天","冷","雪"],tiles:{天气:{py:"tiānqì",en:"weather"},晴天:{py:"qíngtiān",en:"sunny day"},冷:{py:"lěng",en:"cold"},雪:{py:"xuě",en:"snow"}}},grammar:{before:`王一雪：喂，家月，是你啊！有什么事情吗？
白家月：没什么事，就想跟您说说话。
王一雪：好啊。你今天没课吗？
白家月：下午有课。您那里天气怎么样？
王一雪：北京这几天虽然是晴天，但是有点儿冷。
白家月：`,after:"，外边还正下着雪呢！",answer:"我这里比北京冷多了",tokens:["我","这里","比","北京","冷","多","了"]},sentences:[{speaker:"白家月",text:"您那里天气怎么样？",tokens:["您","那里","天气","怎么样"]},{speaker:"王一雪",text:"北京这几天虽然是晴天，但是有点儿冷。",tokens:["北京","这","几天","虽然","是","晴天","但是","有点儿","冷"]},{speaker:"白家月",text:"我这里比北京冷多了，外边还正下着雪呢！",tokens:["我","这里","比","北京","冷","多","了","外边","还","正","下","着","雪","呢"]},{speaker:"王一雪",text:"喂，家月，是你啊！",tokens:["喂","家","月","是","你","啊"]},{speaker:"王一雪",text:"有什么事情吗？",tokens:["有","什么","事情","吗"]},{speaker:"白家月",text:"没什么事，就想跟您说说话。",tokens:["没什么","事","就","想","跟","您","说","说话"]},{speaker:"王一雪",text:"好啊。",tokens:["好","啊"]},{speaker:"王一雪",text:"你今天没课吗？",tokens:["你","今天","没","课","吗"]},{speaker:"白家月",text:"下午有课。",tokens:["下午","有","课"]}],note:"比较句（4）；比较句（5）；比较句（6）"},{n:2,title:"课文2",original:`王一雪：喂，一飞，听家月说你那边下雪了，下得大不大？
王一飞：今天不大，昨天比今天下得大。
王一雪：天气不好，你去外面的时候多穿点儿衣服。
王一飞：这几天我在网上上课，没出去过。
王一雪：那就好，有事记得给我打电话。
王一飞：好的。现在不下雪了，我出去买点儿吃的。
王一雪：一次多买点儿，阴天下雪什么的就少出去吧。`,lines:[{name:"王一雪",zh:"喂，一飞，听家月说你那边下雪了，下得大不大？",py:"Wéi, Yīfēi, tīng Jiāyuè shuō nǐ nàbiān xià xuě le, xià de dà bu dà?",en:"Hello, Yifei, Jiayue says it's snowing where you are—is it heavy?"},{name:"王一飞",zh:"今天不大，昨天比今天下得大。",py:"Jīntiān bú dà, zuótiān bǐ jīntiān xià de dà.",en:"Not today; it snowed harder yesterday than today."},{name:"王一雪",zh:"天气不好，你去外面的时候多穿点儿衣服。",py:"Tiānqì bù hǎo, nǐ qù wàimiàn de shíhou duō chuān diǎnr yīfu.",en:"The weather's bad—dress warmly when you go out."},{name:"王一飞",zh:"这几天我在网上上课，没出去过。",py:"Zhè jǐ tiān wǒ zài wǎng shàng shàngkè, méi chūqu guo.",en:"These days I've been taking classes online and haven't gone out."},{name:"王一雪",zh:"那就好，有事记得给我打电话。",py:"Nà jiù hǎo, yǒu shì jìde gěi wǒ dǎ diànhuà.",en:"That's good—remember to call me if anything comes up."},{name:"王一飞",zh:"好的。现在不下雪了，我出去买点儿吃的。",py:"Hǎo de. Xiànzài bú xià xuě le, wǒ chūqu mǎi diǎnr chī de.",en:"Okay. It's stopped snowing now—I'll go out and buy some food."},{name:"王一雪",zh:"一次多买点儿，阴天下雪什么的就少出去吧。",py:"Yí cì duō mǎi diǎnr, yīntiān xià xuě shénme de jiù shǎo chūqu ba.",en:"Buy more at once, and go out less on cloudy or snowy days."}],vocab:{seg:[{t:"王一雪：喂，一飞，听家月说你那边"},{b:1},{t:`了，下得大不大？
王一飞：今天不大，昨天比今天下得大。
王一雪：天气不好，你去外面的时候多穿点儿`},{b:2},{t:`。
王一飞：这几天我在`},{b:3},{t:`上课，没出去过。
王一雪：那就好，有事记得给我打电话。
王一飞：好的。现在不下雪了，我出去买点儿吃的。
王一雪：一次多买点儿，阴天下雪什么的就少出去吧。`}],answers:["下雪","衣服","网上"],tiles:{下雪:{py:"xià xuě",en:"to snow"},衣服:{py:"yīfu",en:"clothes"},网上:{py:"wǎngshàng",en:"online"}}},grammar:{before:`王一雪：喂，一飞，听家月说你那边下雪了，下得大不大？
王一飞：今天不大，`,after:`。
王一雪：天气不好，你去外面的时候多穿点儿衣服。
王一飞：这几天我在网上上课，没出去过。
王一雪：那就好，有事记得给我打电话。
王一飞：好的。现在不下雪了，我出去买点儿吃的。
王一雪：一次多买点儿，阴天下雪什么的就少出去吧。`,answer:"昨天比今天下得大",tokens:["昨天","比","今天","下","得","大"]},sentences:[{speaker:"王一雪",text:"天气不好，你去外面的时候多穿点儿衣服。",tokens:["天气","不","好","你","去","外面","的","时候","多","穿","点儿","衣服"]},{speaker:"王一飞",text:"这几天我在网上上课，没出去过。",tokens:["这","几天","我","在","网上","上课","没","出去","过"]},{speaker:"王一飞",text:"现在不下雪了，我出去买点儿吃的。",tokens:["现在","不","下雪","了","我","出去","买","点儿","吃","的"]},{speaker:"王一雪",text:"一次多买点儿，阴天下雪什么的就少出去吧。",tokens:["一次","多","买","点儿","阴天","下雪","什么","的","就","少","出去","吧"]},{speaker:"王一飞",text:"今天不大，昨天比今天下得大。",tokens:["今天","不","大","昨天","比","今天","下","得","大"]},{speaker:"王一雪",text:"那就好，有事记得给我打电话。",tokens:["那","就","好","有","事","记得","给","我","打电话"]},{speaker:"王一飞",text:"好的。",tokens:["好","的"]}],note:"比较句（4）；比较句（5）；比较句（6）"},{n:3,title:"课文3",original:`李文：喂，家月，今天天气不错，我们去跑步吧！
白家月：你跑步跑得比我快，我们能一起跑吗？
李文：可以的，我慢慢跑，等你。
白家月：好吧。你真爱跑步啊！
李文：我小时候经常跑步，跑步能让人快乐！
白家月：好，那我准备一下。
李文：我现在坐地铁去找你，一会儿楼下见。`,lines:[{name:"李文",zh:"喂，家月，今天天气不错，我们去跑步吧！",py:"Wéi, Jiāyuè, jīntiān tiānqì búcuò, wǒmen qù pǎobù ba!",en:"Hello, Jiayue, the weather's nice today—let's go for a run!"},{name:"白家月",zh:"你跑步跑得比我快，我们能一起跑吗？",py:"Nǐ pǎobù pǎo de bǐ wǒ kuài, wǒmen néng yìqǐ pǎo ma?",en:"You run faster than me—can we run together?"},{name:"李文",zh:"可以的，我慢慢跑，等你。",py:"Kěyǐ de, wǒ mànmàn pǎo, děng nǐ.",en:"Sure—I'll run slowly and wait for you."},{name:"白家月",zh:"好吧。你真爱跑步啊！",py:"Hǎo ba. Nǐ zhēn ài pǎobù a!",en:"Okay. You really love running!"},{name:"李文",zh:"我小时候经常跑步，跑步能让人快乐！",py:"Wǒ xiǎoshíhou jīngcháng pǎobù, pǎobù néng ràng rén kuàilè!",en:"I ran a lot as a kid—running makes you happy!"},{name:"白家月",zh:"好，那我准备一下。",py:"Hǎo, nà wǒ zhǔnbèi yíxià.",en:"Okay, then let me get ready."},{name:"李文",zh:"我现在坐地铁去找你，一会儿楼下见。",py:"Wǒ xiànzài zuò dìtiě qù zhǎo nǐ, yíhuìr lóuxià jiàn.",en:"I'll take the subway to meet you now—see you downstairs soon."}],vocab:{seg:[{t:"李文：喂，家月，今天天气不错，我们去"},{b:1},{t:`吧！
白家月：你跑步跑得比我快，我们能一起跑吗？
李文：可以的，我`},{b:2},{t:`跑，等你。
白家月：好吧。你真爱跑步啊！
李文：我小时候经常跑步，跑步能让人快乐！
白家月：好，那我准备一下。
李文：我现在坐`},{b:3},{t:"去找你，一会儿楼下见。"}],answers:["跑步","慢慢","地铁"],tiles:{跑步:{py:"pǎobù",en:"to run; jog"},慢慢:{py:"mànmàn",en:"slowly"},地铁:{py:"dìtiě",en:"subway"}}},grammar:{before:`李文：喂，家月，今天天气不错，我们去跑步吧！
白家月：`,after:`，我们能一起跑吗？
李文：可以的，我慢慢跑，等你。
白家月：好吧。你真爱跑步啊！
李文：我小时候经常跑步，跑步能让人快乐！
白家月：好，那我准备一下。
李文：我现在坐地铁去找你，一会儿楼下见。`,answer:"你跑步跑得比我快",tokens:["你","跑步","跑","得","比","我","快"]},sentences:[{speaker:"李文",text:"喂，家月，今天天气不错，我们去跑步吧！",tokens:["喂","家","月","今天","天气","不错","我们","去","跑步","吧"]},{speaker:"白家月",text:"你跑步跑得比我快，我们能一起跑吗？",tokens:["你","跑步","跑","得","比","我","快","我们","能","一起","跑","吗"]},{speaker:"李文",text:"可以的，我慢慢跑，等你。",tokens:["可以","的","我","慢慢","跑","等","你"]},{speaker:"白家月",text:"你真爱跑步啊！",tokens:["你","真","爱","跑步","啊"]},{speaker:"李文",text:"我小时候经常跑步，跑步能让人快乐！",tokens:["我","小时候","经常","跑步","跑步","能","让","人","快乐"]},{speaker:"李文",text:"我现在坐地铁去找你，一会儿楼下见。",tokens:["我","现在","坐","地铁","去","找","你","一会儿","楼下","见"]},{speaker:"白家月",text:"好吧。",tokens:["好","吧"]},{speaker:"白家月",text:"好，那我准备一下。",tokens:["好","那","我","准备","一下"]}],note:"比较句（4）；比较句（5）；比较句（6）"},{n:4,title:"课文4",original:"前几天天气不好，我没走路，每天坐两站地铁去学校。今天是个大晴天，李文让我跟他去外面跑步。他小时候经常跑步，跑得比我快，但是他会等我。跟李文一起跑步，我好高兴啊！",lines:[{name:"",zh:"前几天天气不好，我没走路，每天坐两站地铁去学校。今天是个大晴天，李文让我跟他去外面跑步。他小时候经常跑步，跑得比我快，但是他会等我。跟李文一起跑步，我好高兴啊！",py:"Qián jǐ tiān tiānqì bù hǎo, wǒ méi zǒulù, měi tiān zuò liǎng zhàn dìtiě qù xuéxiào. Jīntiān shì ge dà qíngtiān, Lǐ Wén ràng wǒ gēn tā qù wàimiàn pǎobù. Tā xiǎoshíhou jīngcháng pǎobù, pǎo de bǐ wǒ kuài, dànshì tā huì děng wǒ. Gēn Lǐ Wén yìqǐ pǎobù, wǒ hǎo gāoxìng a!",en:"The weather was bad the past few days, so I didn't walk—I took the subway two stops to school each day. Today is a bright sunny day, and Li Wen invited me to go running outside with him. He ran a lot as a kid and runs faster than me, but he waits for me. Running with Li Wen makes me so happy!"}],vocab:{seg:[{t:"前几天天气不好，我没走路，每天坐两站"},{b:1},{t:"去学校。今天是个大"},{b:2},{t:"，李文让我跟他去外面"},{b:3},{t:"。他小时候经常跑步，跑得比我快，但是他会等我。跟李文一起跑步，我好高兴啊！"}],answers:["地铁","晴天","跑步"],tiles:{地铁:{py:"dìtiě",en:"subway"},晴天:{py:"qíngtiān",en:"sunny day"},跑步:{py:"pǎobù",en:"to run; jog"}}},grammar:{before:"前几天天气不好，我没走路，每天坐两站地铁去学校。今天是个大晴天，李文让我跟他去外面跑步。他小时候经常跑步，",after:"，但是他会等我。跟李文一起跑步，我好高兴啊！",answer:"跑得比我快",tokens:["跑","得","比","我","快"]},sentences:[{speaker:"",text:"前几天天气不好，我没走路，每天坐两站地铁去学校。",tokens:["前","几天","天气","不","好","我","没","走路","每天","坐","两","站","地铁","去","学校"]},{speaker:"",text:"今天是个大晴天，李文让我跟他去外面跑步。",tokens:["今天","是","个","大","晴天","李文","让","我","跟","他","去","外面","跑步"]},{speaker:"",text:"他小时候经常跑步，跑得比我快，但是他会等我。",tokens:["他","小时候","经常","跑步","跑","得","比","我","快","但是","他","会","等","我"]},{speaker:"",text:"跟李文一起跑步，我好高兴啊！",tokens:["跟","李文","一起","跑步","我","好","高兴","啊"]}],note:"比较句（4）；比较句（5）；比较句（6）"}]},{num:13,name:"我们爱上中文课",texts:[{n:1,title:"课文1",original:`白家月：时间过得真快啊！新年就要到了。
陈天中：这一年王老师教我们中文，每天工作都很累。
白家月：是啊，她教得很好。因为她，我们都非常爱上中文课。
陈天中：我们给她准备个新年礼物吧。你觉得送给她什么好呢？
白家月：王老师喜欢花，就送给她花吧。
陈天中：那我们去花店看看，现在买花的人多，希望花店还有漂亮的花。`,lines:[{name:"白家月",zh:"时间过得真快啊！新年就要到了。",py:"Shíjiān guò de zhēn kuài a! Xīnnián jiù yào dào le.",en:"Time flies! The New Year is almost here."},{name:"陈天中",zh:"这一年王老师教我们中文，每天工作都很累。",py:"Zhè yì nián Wáng lǎoshī jiāo wǒmen Zhōngwén, měi tiān gōngzuò dōu hěn lèi.",en:"This year Teacher Wang taught us Chinese, and her work was tiring every day."},{name:"白家月",zh:"是啊，她教得很好。因为她，我们都非常爱上中文课。",py:"Shì a, tā jiāo de hěn hǎo. Yīnwèi tā, wǒmen dōu fēicháng ài shàng Zhōngwén kè.",en:"Yeah, she teaches very well. Because of her, we all love going to Chinese class."},{name:"陈天中",zh:"我们给她准备个新年礼物吧。你觉得送给她什么好呢？",py:"Wǒmen gěi tā zhǔnbèi ge xīnnián lǐwù ba. Nǐ juéde sòng gěi tā shénme hǎo ne?",en:"Let's get her a New Year gift. What do you think we should give her?"},{name:"白家月",zh:"王老师喜欢花，就送给她花吧。",py:"Wáng lǎoshī xǐhuan huā, jiù sòng gěi tā huā ba.",en:"Teacher Wang likes flowers—let's give her flowers."},{name:"陈天中",zh:"那我们去花店看看，现在买花的人多，希望花店还有漂亮的花。",py:"Nà wǒmen qù huādiàn kànkan, xiànzài mǎi huā de rén duō, xīwàng huādiàn hái yǒu piàoliang de huā.",en:"Then let's check the flower shop—lots of people are buying flowers now; I hope the shop still has some pretty ones."}],vocab:{seg:[{t:"白家月：时间过得真快啊！"},{b:1},{t:`就要到了。
陈天中：这一年王老师`},{b:2},{t:`我们中文，每天工作都很累。
白家月：是啊，她教得很好。因为她，我们都非常爱上中文课。
陈天中：我们给她准备个新年礼物吧。你觉得送给她什么好呢？
白家月：王老师喜欢`},{b:3},{t:`，就送给她花吧。
陈天中：那我们去花店看看，现在买花的人多，`},{b:4},{t:"花店还有漂亮的花。"}],answers:["新年","教","花","希望"],tiles:{新年:{py:"xīnnián",en:"New Year"},教:{py:"jiāo",en:"to teach"},花:{py:"huā",en:"flower"},希望:{py:"xīwàng",en:"to hope; hope"}}},grammar:{before:`白家月：时间过得真快啊！新年就要到了。
陈天中：这一年王老师教我们中文，每天工作都很累。
白家月：是啊，她教得很好。因为她，我们都非常爱上中文课。
陈天中：我们给她准备个新年礼物吧。你觉得送给她什么好呢？
白家月：王老师喜欢花，`,after:`。
陈天中：那我们去花店看看，现在买花的人多，希望花店还有漂亮的花。`,answer:"就送给她花吧",tokens:["就","送给","她","花","吧"]},sentences:[{speaker:"白家月",text:"新年就要到了。",tokens:["新年","就要","到","了"]},{speaker:"陈天中",text:"这一年王老师教我们中文，每天工作都很累。",tokens:["这","一年","王老师","教","我们","中文","每天","工作","都","很","累"]},{speaker:"白家月",text:"是啊，她教得很好。",tokens:["是","啊","她","教","得","很","好"]},{speaker:"陈天中",text:"我们给她准备个新年礼物吧。",tokens:["我们","给","她","准备","个","新年","礼物","吧"]},{speaker:"白家月",text:"王老师喜欢花，就送给她花吧。",tokens:["王老师","喜欢","花","就","送给","她","花","吧"]},{speaker:"白家月",text:"时间过得真快啊！",tokens:["时间","过","得","真","快","啊"]},{speaker:"白家月",text:"因为她，我们都非常爱上中文课。",tokens:["因为","她","我们","都","非常","爱","上","中文","课"]},{speaker:"陈天中",text:"你觉得送给她什么好呢？",tokens:["你","觉得","送给","她","什么","好","呢"]}],note:"双宾语句（2）；比较句（7）；比较句（8）"},{n:2,title:"课文2",original:`白家月：王老师，今天的词比昨天多了十个。
王一飞：是啊！你们都学会了吗？
安妮：学会了，没有问题。
王一飞：好。现在我来说，你们在本子上面写。
……
王一飞：同学们，“洗手间”的“间”字写错了，它的里面是“日”，不是“口”。
白家月：“日”比“口”多一笔，写“口”就是“问题”的“问”了。
王一飞：没错，你说得很对。`,lines:[{name:"白家月",zh:"王老师，今天的词比昨天多了十个。",py:"Wáng lǎoshī, jīntiān de cí bǐ zuótiān duō le shí ge.",en:"Teacher Wang, there are ten more words today than yesterday."},{name:"王一飞",zh:"是啊！你们都学会了吗？",py:"Shì a! Nǐmen dōu xuéhuì le ma?",en:"Yes! Have you all learned them?"},{name:"安妮",zh:"学会了，没有问题。",py:"Xuéhuì le, méiyǒu wèntí.",en:"Yes, no problem."},{name:"王一飞",zh:"好。现在我来说，你们在本子上面写。",py:"Hǎo. Xiànzài wǒ lái shuō, nǐmen zài běnzi shàngmiàn xiě.",en:"Good. Now I'll say them, and you write them in your notebooks."},{name:"",zh:"……",py:"",en:""},{name:"王一飞",zh:"同学们，“洗手间”的“间”字写错了，它的里面是“日”，不是“口”。",py:'Tóngxuémen, "xǐshǒujiān" de "jiān" zì xiěcuò le, tā de lǐmiàn shì "rì", bú shì "kǒu".',en:'Class, the character "jiān" in "restroom" is written wrong—inside it is "日" (rì), not "口" (kǒu).'},{name:"白家月",zh:"“日”比“口”多一笔，写“口”就是“问题”的“问”了。",py:'"Rì" bǐ "kǒu" duō yì bǐ, xiě "kǒu" jiù shì "wèntí" de "wèn" le.',en:'"日" has one more stroke than "口"; if you write "口", it becomes the "wèn" in "wèntí" (question).'},{name:"王一飞",zh:"没错，你说得很对。",py:"Méicuò, nǐ shuō de hěn duì.",en:"Exactly, you're quite right."}],vocab:{seg:[{t:`白家月：王老师，今天的词比昨天多了十个。
王一飞：是啊！你们都学会了吗？
安妮：学会了，没有问题。
王一飞：好。现在我来说，你们在本子`},{b:1},{t:`写。
……
王一飞：同学们，“`},{b:2},{t:"”的“间”字写错了，它的"},{b:3},{t:`是“日”，不是“口”。
白家月：“日”比“口”多一`},{b:4},{t:`，写“口”就是“问题”的“问”了。
王一飞：没错，你说得很对。`}],answers:["上面","洗手间","里面","笔"],tiles:{上面:{py:"shàngmiàn",en:"on; above; top"},洗手间:{py:"xǐshǒujiān",en:"restroom; washroom"},里面:{py:"lǐmiàn",en:"inside"},笔:{py:"bǐ",en:"pen; pencil"}}},grammar:{before:"白家月：王老师，",after:`。
王一飞：是啊！你们都学会了吗？
安妮：学会了，没有问题。
王一飞：好。现在我来说，你们在本子上面写。
……
王一飞：同学们，“洗手间”的“间”字写错了，它的里面是“日”，不是“口”。
白家月：“日”比“口”多一笔，写“口”就是“问题”的“问”了。
王一飞：没错，你说得很对。`,answer:"今天的词比昨天多了十个",tokens:["今天","的","词","比","昨天","多","了","十个"]},sentences:[{speaker:"王一飞",text:"现在我来说，你们在本子上面写。",tokens:["现在","我","来说","你们","在","本子","上面","写"]},{speaker:"白家月",text:"王老师，今天的词比昨天多了十个。",tokens:["王老师","今天","的","词","比","昨天","多","了","十个"]},{speaker:"王一飞",text:"是啊！",tokens:["是","啊"]},{speaker:"王一飞",text:"你们都学会了吗？",tokens:["你们","都","学会","了","吗"]},{speaker:"安妮",text:"学会了，没有问题。",tokens:["学会","了","没有","问题"]},{speaker:"王一飞",text:"没错，你说得很对。",tokens:["没","错","你","说","得","很","对"]}],note:"双宾语句（2）；比较句（7）；比较句（8）"},{n:3,title:"课文3",original:`安妮：家月，你觉得这个本子怎么样？
白家月：很漂亮，多少钱一个？
安妮：比我们一起买的那个本子贵一点儿。
白家月：这么漂亮的本子，不可能贵一点儿吧？
安妮：我是上网买的，真没那么贵。我买了两个，送你一个。
白家月：谢谢！那我送给你什么呢？
安妮：咖啡杯吧，我最喜欢喝咖啡了。
白家月：好，那样我们就都有新年礼物了！`,lines:[{name:"安妮",zh:"家月，你觉得这个本子怎么样？",py:"Jiāyuè, nǐ juéde zhège běnzi zěnmeyàng?",en:"Jiayue, what do you think of this notebook?"},{name:"白家月",zh:"很漂亮，多少钱一个？",py:"Hěn piàoliang, duōshao qián yí ge?",en:"Very nice—how much each?"},{name:"安妮",zh:"比我们一起买的那个本子贵一点儿。",py:"Bǐ wǒmen yìqǐ mǎi de nàge běnzi guì yìdiǎnr.",en:"A bit more expensive than the one we bought together."},{name:"白家月",zh:"这么漂亮的本子，不可能贵一点儿吧？",py:"Zhème piàoliang de běnzi, bù kěnéng guì yìdiǎnr ba?",en:"Such a pretty notebook can't be only a bit more expensive, right?"},{name:"安妮",zh:"我是上网买的，真没那么贵。我买了两个，送你一个。",py:"Wǒ shì shàngwǎng mǎi de, zhēn méi nàme guì. Wǒ mǎi le liǎng ge, sòng nǐ yí ge.",en:"I bought it online—it's really not that expensive. I bought two; here's one for you."},{name:"白家月",zh:"谢谢！那我送给你什么呢？",py:"Xièxie! Nà wǒ sòng gěi nǐ shénme ne?",en:"Thanks! Then what should I give you?"},{name:"安妮",zh:"咖啡杯吧，我最喜欢喝咖啡了。",py:"Kāfēi bēi ba, wǒ zuì xǐhuan hē kāfēi le.",en:"A coffee mug—I love coffee most."},{name:"白家月",zh:"好，那样我们就都有新年礼物了！",py:"Hǎo, nàyàng wǒmen jiù dōu yǒu xīnnián lǐwù le!",en:"Great—then we'll both have New Year gifts!"}],vocab:{seg:[{t:`安妮：家月，你觉得这个本子怎么样？
白家月：很漂亮，多少钱一个？
安妮：比我们一起买的那个本子贵一点儿。
白家月：这么漂亮的本子，不`},{b:1},{t:`贵一点儿吧？
安妮：我是`},{b:2},{t:`买的，真没那么贵。我买了两个，送你一个。
白家月：谢谢！那我送给你什么呢？
安妮：`},{b:3},{t:`吧，我最喜欢喝咖啡了。
白家月：好，`},{b:4},{t:"我们就都有新年礼物了！"}],answers:["可能","上网","咖啡杯","那样"],tiles:{可能:{py:"kěnéng",en:"may; might; possible"},上网:{py:"shàngwǎng",en:"to go online"},咖啡杯:{py:"kāfēibēi",en:"coffee cup; mug"},那样:{py:"nàyàng",en:"like that; that way"}}},grammar:{before:`安妮：家月，你觉得这个本子怎么样？
白家月：很漂亮，多少钱一个？
安妮：`,after:`。
白家月：这么漂亮的本子，不可能贵一点儿吧？
安妮：我是上网买的，真没那么贵。我买了两个，送你一个。
白家月：谢谢！那我送给你什么呢？
安妮：咖啡杯吧，我最喜欢喝咖啡了。
白家月：好，那样我们就都有新年礼物了！`,answer:"比我们一起买的那个本子贵一点儿",tokens:["比","我们","一起","买","的","那个","本子","贵","一点儿"]},sentences:[{speaker:"白家月",text:"这么漂亮的本子，不可能贵一点儿吧？",tokens:["这么","漂亮","的","本子","不","可能","贵","一点儿","吧"]},{speaker:"安妮",text:"我是上网买的，真没那么贵。",tokens:["我","是","上网","买","的","真","没","那么","贵"]},{speaker:"安妮",text:"咖啡杯吧，我最喜欢喝咖啡了。",tokens:["咖啡杯","吧","我","最","喜欢","喝","咖啡","了"]},{speaker:"白家月",text:"好，那样我们就都有新年礼物了！",tokens:["好","那样","我们","就","都","有","新年","礼物","了"]},{speaker:"安妮",text:"家月，你觉得这个本子怎么样？",tokens:["家","月","你","觉得","这个","本子","怎么样"]},{speaker:"白家月",text:"很漂亮，多少钱一个？",tokens:["很","漂亮","多少","钱","一个"]},{speaker:"安妮",text:"比我们一起买的那个本子贵一点儿。",tokens:["比","我们","一起","买","的","那个","本子","贵","一点儿"]},{speaker:"安妮",text:"我买了两个，送你一个。",tokens:["我","买","了","两个","送","你","一个"]},{speaker:"白家月",text:"那我送给你什么呢？",tokens:["那","我","送给","你","什么","呢"]}],note:"双宾语句（2）；比较句（7）；比较句（8）"},{n:4,title:"课文4",original:"新年就要到了，安妮送给我一个新本子。她告诉我是在网上买的，比我的本子贵一点儿。我们班同学也送了王老师漂亮的花，希望她高高兴兴地过个新年。",lines:[{name:"",zh:"新年就要到了，安妮送给我一个新本子。她告诉我是在网上买的，比我的本子贵一点儿。我们班同学也送了王老师漂亮的花，希望她高高兴兴地过个新年。",py:"Xīnnián jiù yào dào le, Ānnī sòng gěi wǒ yí ge xīn běnzi. Tā gàosu wǒ shì zài wǎng shàng mǎi de, bǐ wǒ de běnzi guì yìdiǎnr. Wǒmen bān tóngxué yě sòng le Wáng lǎoshī piàoliang de huā, xīwàng tā gāogāoxìngxìng de guò ge xīnnián.",en:"The New Year is almost here, and Annie gave me a new notebook. She told me she bought it online and it's a bit pricier than mine. Our class also gave Teacher Wang beautiful flowers, hoping she'll have a happy New Year."}],vocab:{seg:[{b:1},{t:"就要到了，安妮送给我一个新本子。她"},{b:2},{t:"我是在网上买的，比我的本子贵一点儿。我们"},{b:3},{t:"同学也送了王老师漂亮的花，希望她高高兴兴地过个新年。"}],answers:["新年","告诉","班"],tiles:{新年:{py:"xīnnián",en:"New Year"},告诉:{py:"gàosu",en:"to tell"},班:{py:"bān",en:"class; group"}}},grammar:{before:"新年就要到了，安妮送给我一个新本子。她告诉我是在网上买的，",after:"。我们班同学也送了王老师漂亮的花，希望她高高兴兴地过个新年。",answer:"比我的本子贵一点儿",tokens:["比","我","的","本子","贵","一点儿"]},sentences:[{speaker:"",text:"新年就要到了，安妮送给我一个新本子。",tokens:["新年","就要","到","了","安妮","送给","我","一个","新","本子"]},{speaker:"",text:"她告诉我是在网上买的，比我的本子贵一点儿。",tokens:["她","告诉","我","是","在","网上","买","的","比","我","的","本子","贵","一点儿"]}],note:"双宾语句（2）；比较句（7）；比较句（8）"}]},{num:14,name:"一个人过年多没意思啊",texts:[{n:1,title:"课文1",original:`李文：王老师，你家楼下站着一个人。
王一飞：我家楼下？我看看。
李文：那个人穿着黑色的裤子，手里还拿着一个黑色的包。
王一飞：我看见那个人了，他是我男朋友。
李文：那我们快过去吧。`,lines:[{name:"李文",zh:"王老师，你家楼下站着一个人。",py:"Wáng lǎoshī, nǐ jiā lóuxià zhànzhe yí ge rén.",en:"Teacher Wang, there's someone standing downstairs at your place."},{name:"王一飞",zh:"我家楼下？我看看。",py:"Wǒ jiā lóuxià? Wǒ kànkan.",en:"Downstairs at my place? Let me look."},{name:"李文",zh:"那个人穿着黑色的裤子，手里还拿着一个黑色的包。",py:"Nàge rén chuānzhe hēisè de kùzi, shǒu lǐ hái názhe yí ge hēisè de bāo.",en:"That person is wearing black pants and holding a black bag."},{name:"王一飞",zh:"我看见那个人了，他是我男朋友。",py:"Wǒ kànjiàn nàge rén le, tā shì wǒ nánpéngyou.",en:"I see him—that's my boyfriend."},{name:"李文",zh:"那我们快过去吧。",py:"Nà wǒmen kuài guòqu ba.",en:"Then let's hurry over."}],vocab:{seg:[{t:"李文：王老师，你家楼下"},{b:1},{t:`着一个人。
王一飞：我家楼下？我看看。
李文：那个人穿着黑色的`},{b:2},{t:"，手里还拿着一个黑色的"},{b:3},{t:`。
王一飞：我看见那个人了，他是我男朋友。
李文：那我们快过去吧。`}],answers:["站","裤子","包"],tiles:{站:{py:"zhàn",en:"to stand; station"},裤子:{py:"kùzi",en:"pants; trousers"},包:{py:"bāo",en:"bag; package"}}},grammar:{before:"李文：王老师，",after:`。
王一飞：我家楼下？我看看。
李文：那个人穿着黑色的裤子，手里还拿着一个黑色的包。
王一飞：我看见那个人了，他是我男朋友。
李文：那我们快过去吧。`,answer:"你家楼下站着一个人",tokens:["你家","楼下","站","着","一个","人"]},sentences:[{speaker:"李文",text:"王老师，你家楼下站着一个人。",tokens:["王老师","你家","楼下","站","着","一个","人"]},{speaker:"李文",text:"那个人穿着黑色的裤子，手里还拿着一个黑色的包。",tokens:["那个","人","穿着","黑色","的","裤子","手里","还","拿","着","一个","黑色","的","包"]},{speaker:"王一飞",text:"我家楼下？",tokens:["我家","楼下"]},{speaker:"王一飞",text:"我看看。",tokens:["我","看看"]},{speaker:"王一飞",text:"我看见那个人了，他是我男朋友。",tokens:["我","看见","那个","人","了","他","是","我","男朋友"]},{speaker:"李文",text:"那我们快过去吧。",tokens:["那","我们","快","过去","吧"]}],note:"存现句（2）；程度副词“多”；复合趋向补语"},{n:2,title:"课文2",original:`王一飞：同乐，真是你啊！上次打电话，你说有时间过来看我，没想到这么快就来了！
杨同乐：就要过年了，你一个人在这儿多没意思啊，所以我就早早过来了。
王一飞：你能来，我太高兴了！
杨同乐：一飞，你旁边这位是？
王一飞：同乐，这是李文，他在我们学校学医。李文，这是我男朋友杨同乐。
杨同乐：李文，很高兴认识你！
李文：认识你我也很高兴！我家就在前面那个楼，有时间来玩。`,lines:[{name:"王一飞",zh:"同乐，真是你啊！上次打电话，你说有时间过来看我，没想到这么快就来了！",py:"Tónglè, zhēn shì nǐ a! Shàng cì dǎ diànhuà, nǐ shuō yǒu shíjiān guòlai kàn wǒ, méi xiǎngdào zhème kuài jiù lái le!",en:"Tongle, it's really you! Last time on the phone you said you'd come see me when you had time—I didn't expect you so soon!"},{name:"杨同乐",zh:"就要过年了，你一个人在这儿多没意思啊，所以我就早早过来了。",py:"Jiù yào guònián le, nǐ yí ge rén zài zhèr duō méi yìsi a, suǒyǐ wǒ jiù zǎozǎo guòlai le.",en:"New Year's almost here, and being here alone is no fun, so I came over early."},{name:"王一飞",zh:"你能来，我太高兴了！",py:"Nǐ néng lái, wǒ tài gāoxìng le!",en:"I'm so glad you could come!"},{name:"杨同乐",zh:"一飞，你旁边这位是？",py:"Yīfēi, nǐ pángbiān zhè wèi shì?",en:"Yifei, who's this next to you?"},{name:"王一飞",zh:"同乐，这是李文，他在我们学校学医。李文，这是我男朋友杨同乐。",py:"Tónglè, zhè shì Lǐ Wén, tā zài wǒmen xuéxiào xué yī. Lǐ Wén, zhè shì wǒ nánpéngyou Yáng Tónglè.",en:"Tongle, this is Li Wen—he studies medicine at our school. Li Wen, this is my boyfriend Yang Tongle."},{name:"杨同乐",zh:"李文，很高兴认识你！",py:"Lǐ Wén, hěn gāoxìng rènshi nǐ!",en:"Li Wen, nice to meet you!"},{name:"李文",zh:"认识你我也很高兴！我家就在前面那个楼，有时间来玩。",py:"Rènshi nǐ wǒ yě hěn gāoxìng! Wǒ jiā jiù zài qiánmiàn nàge lóu, yǒu shíjiān lái wán.",en:"Nice to meet you too! I live in that building up ahead—come by when you have time."}],vocab:{seg:[{t:`王一飞：同乐，真是你啊！上次打电话，你说有时间过来看我，没想到这么快就来了！
杨同乐：就要`},{b:1},{t:"了，你一个人在这儿多"},{b:2},{t:`啊，所以我就早早过来了。
王一飞：你能来，我太高兴了！
杨同乐：一飞，你旁边这`},{b:3},{t:`是？
王一飞：同乐，这是李文，他在我们学校学医。李文，这是我男朋友杨同乐。
杨同乐：李文，很高兴认识你！
李文：认识你我也很高兴！我家就在`},{b:4},{t:"那个楼，有时间来玩。"}],answers:["过年","没意思","位","前面"],tiles:{过年:{py:"guònián",en:"to celebrate Spring Festival"},没意思:{py:"méiyìsi",en:"boring; uninteresting"},位:{py:"wèi",en:"polite measure word for people"},前面:{py:"qiánmiàn",en:"in front; ahead"}}},grammar:{before:`王一飞：同乐，真是你啊！上次打电话，你说有时间过来看我，没想到这么快就来了！
杨同乐：就要过年了，`,after:`，所以我就早早过来了。
王一飞：你能来，我太高兴了！
杨同乐：一飞，你旁边这位是？
王一飞：同乐，这是李文，他在我们学校学医。李文，这是我男朋友杨同乐。
杨同乐：李文，很高兴认识你！
李文：认识你我也很高兴！我家就在前面那个楼，有时间来玩。`,answer:"你一个人在这儿多没意思啊",tokens:["你","一个","人","在","这儿","多","没意思","啊"]},sentences:[{speaker:"杨同乐",text:"一飞，你旁边这位是？",tokens:["一","飞","你","旁边","这","位","是"]},{speaker:"李文",text:"我家就在前面那个楼，有时间来玩。",tokens:["我家","就","在","前面","那个","楼","有时","间","来","玩"]},{speaker:"王一飞",text:"同乐，真是你啊！",tokens:["同","乐","真","是","你","啊"]},{speaker:"王一飞",text:"你能来，我太高兴了！",tokens:["你","能","来","我","太","高兴","了"]},{speaker:"王一飞",text:"同乐，这是李文，他在我们学校学医。",tokens:["同","乐","这","是","李文","他","在","我们","学校","学","医"]},{speaker:"王一飞",text:"李文，这是我男朋友杨同乐。",tokens:["李文","这","是","我","男朋友","杨","同","乐"]},{speaker:"杨同乐",text:"李文，很高兴认识你！",tokens:["李文","很","高兴","认识","你"]},{speaker:"李文",text:"认识你我也很高兴！",tokens:["认识","你","我","也","很","高兴"]}],note:"存现句（2）；程度副词“多”；复合趋向补语"},{n:3,title:"课文3",original:`杨同乐：一飞，你住的房子真不错，很大，离学校也不远。
王一飞：是啊！我楼下还住着一家中国人，他们人很好。
杨同乐：这样你有事情就可以找他们帮忙。
王一飞：对，我也帮他们家的小孩儿学中文。
杨同乐：我记得你跟我说过，是个女孩儿，学得也很好。
王一飞：没错，她经常跑上来找我玩。
杨同乐：你问问他们什么时候有时间，我请他们吃个饭。`,lines:[{name:"杨同乐",zh:"一飞，你住的房子真不错，很大，离学校也不远。",py:"Yīfēi, nǐ zhù de fángzi zhēn búcuò, hěn dà, lí xuéxiào yě bù yuǎn.",en:"Yifei, your place is really nice—big, and not far from school either."},{name:"王一飞",zh:"是啊！我楼下还住着一家中国人，他们人很好。",py:"Shì a! Wǒ lóuxià hái zhùzhe yì jiā Zhōngguórén, tāmen rén hěn hǎo.",en:"Yeah! A Chinese family lives downstairs from me—they're very nice."},{name:"杨同乐",zh:"这样你有事情就可以找他们帮忙。",py:"Zhèyàng nǐ yǒu shìqing jiù kěyǐ zhǎo tāmen bāngmáng.",en:"That way you can ask them for help if anything comes up."},{name:"王一飞",zh:"对，我也帮他们家的小孩儿学中文。",py:"Duì, wǒ yě bāng tāmen jiā de xiǎoháir xué Zhōngwén.",en:"Right, and I also help their kid learn Chinese."},{name:"杨同乐",zh:"我记得你跟我说过，是个女孩儿，学得也很好。",py:"Wǒ jìde nǐ gēn wǒ shuōguo, shì ge nǚháir, xué de yě hěn hǎo.",en:"I remember you told me—she's a girl, and she learns well."},{name:"王一飞",zh:"没错，她经常跑上来找我玩。",py:"Méicuò, tā jīngcháng pǎo shànglai zhǎo wǒ wán.",en:"That's right—she often runs up to hang out with me."},{name:"杨同乐",zh:"你问问他们什么时候有时间，我请他们吃个饭。",py:"Nǐ wènwen tāmen shénme shíhou yǒu shíjiān, wǒ qǐng tāmen chī ge fàn.",en:"Ask them when they're free—I'd like to treat them to a meal."}],vocab:{seg:[{t:"杨同乐：一飞，你住的"},{b:1},{t:`真不错，很大，离学校也不远。
王一飞：是啊！我楼下还住着一家中国人，他们人很好。
杨同乐：这样你有事情就可以找他们帮忙。
王一飞：对，我也帮他们家的`},{b:2},{t:`学中文。
杨同乐：我记得你跟我说过，是个`},{b:3},{t:`，学得也很好。
王一飞：没错，她经常跑上来找我玩。
杨同乐：你问问他们什么时候有时间，我请他们吃个饭。`}],answers:["房子","小孩儿","女孩儿"],tiles:{房子:{py:"fángzi",en:"house; apartment"},小孩儿:{py:"xiǎoháir",en:"child; kid"},女孩儿:{py:"nǚháir",en:"girl"}}},grammar:{before:`杨同乐：一飞，你住的房子真不错，很大，离学校也不远。
王一飞：是啊！我楼下还住着一家中国人，他们人很好。
杨同乐：这样你有事情就可以找他们帮忙。
王一飞：对，我也帮他们家的小孩儿学中文。
杨同乐：我记得你跟我说过，是个女孩儿，学得也很好。
王一飞：没错，`,after:`。
杨同乐：你问问他们什么时候有时间，我请他们吃个饭。`,answer:"她经常跑上来找我玩",tokens:["她","经常","跑上来","找","我","玩"]},sentences:[{speaker:"杨同乐",text:"一飞，你住的房子真不错，很大，离学校也不远。",tokens:["一","飞","你","住","的","房子","真","不错","很","大","离","学校","也","不","远"]},{speaker:"王一飞",text:"对，我也帮他们家的小孩儿学中文。",tokens:["对","我","也","帮","他们","家","的","小孩儿","学","中文"]},{speaker:"杨同乐",text:"我记得你跟我说过，是个女孩儿，学得也很好。",tokens:["我","记得","你","跟","我","说","过","是","个","女孩儿","学","得","也","很","好"]},{speaker:"王一飞",text:"是啊！",tokens:["是","啊"]},{speaker:"王一飞",text:"我楼下还住着一家中国人，他们人很好。",tokens:["我","楼下","还","住","着","一家","中国","人","他们","人","很","好"]},{speaker:"杨同乐",text:"这样你有事情就可以找他们帮忙。",tokens:["这样","你","有","事情","就","可以","找","他们","帮忙"]},{speaker:"王一飞",text:"没错，她经常跑上来找我玩。",tokens:["没","错","她","经常","跑上来","找","我","玩"]},{speaker:"杨同乐",text:"你问问他们什么时候有时间，我请他们吃个饭。",tokens:["你","问","问","他们","什么","时候","有时","间","我","请","他们","吃","个","饭"]}],note:"存现句（2）；程度副词“多”；复合趋向补语"},{n:4,title:"课文4",original:"我男朋友姓杨，叫杨同乐。他高个子、大眼睛，唱歌唱得很好，跳舞跳得也不错。他和我姐姐一起工作，是姐姐介绍我们认识的。他告诉我，从见到我的第一天开始，他就喜欢上我了。",lines:[{name:"",zh:"我男朋友姓杨，叫杨同乐。他高个子、大眼睛，唱歌唱得很好，跳舞跳得也不错。他和我姐姐一起工作，是姐姐介绍我们认识的。他告诉我，从见到我的第一天开始，他就喜欢上我了。",py:"Wǒ nánpéngyou xìng Yáng, jiào Yáng Tónglè. Tā gāo gèzi, dà yǎnjing, chànggē chàng de hěn hǎo, tiàowǔ tiào de yě búcuò. Tā hé wǒ jiějie yìqǐ gōngzuò, shì jiějie jièshào wǒmen rènshi de. Tā gàosu wǒ, cóng jiàndào wǒ de dì-yī tiān kāishǐ, tā jiù xǐhuan shàng wǒ le.",en:"My boyfriend's surname is Yang; his name is Yang Tongle. He's tall with big eyes, sings very well, and dances pretty well too. He works with my sister, and she introduced us. He told me that from the very first day he saw me, he fell for me."}],vocab:{seg:[{t:"我男朋友"},{b:1},{t:"杨，叫杨同乐。他高个子、大"},{b:2},{t:"，唱歌唱得很好，"},{b:3},{t:"跳得也不错。他和我姐姐一起工作，是姐姐介绍我们认识的。他告诉我，从见到我的第一天开始，他就喜欢上我了。"}],answers:["姓","眼睛","跳舞"],tiles:{姓:{py:"xìng",en:"to be surnamed"},眼睛:{py:"yǎnjing",en:"eye; eyes"},跳舞:{py:"tiàowǔ",en:"to dance"}}},grammar:{before:"我男朋友姓杨，叫杨同乐。他高个子、大眼睛，唱歌唱得很好，跳舞跳得也不错。他和我姐姐一起工作，是姐姐介绍我们认识的。他告诉我，从见到我的第一天开始，",after:"。",answer:"他就喜欢上我了",tokens:["他","就","喜欢","上","我","了"]},sentences:[{speaker:"",text:"我男朋友姓杨，叫杨同乐。",tokens:["我","男朋友","姓","杨","叫","杨","同","乐"]},{speaker:"",text:"他高个子、大眼睛，唱歌唱得很好，跳舞跳得也不错。",tokens:["他","高","个子","大","眼睛","唱歌","唱","得","很","好","跳舞","跳","得","也","不错"]},{speaker:"",text:"他和我姐姐一起工作，是姐姐介绍我们认识的。",tokens:["他","和","我","姐姐","一起","工作","是","姐姐","介绍","我们","认识","的"]}],note:"存现句（2）；程度副词“多”；复合趋向补语"}]},{num:15,name:"我想再去一次中国",texts:[{n:1,title:"课文1",original:`王一飞：考试就要开始了，请大家写上姓名，写好后就可以做题了。
……
白家月：老师，我做完了。
陈天中：老师，我也做完了。
王一飞：……对了，你们考完试想做什么？
白家月：我很想去中国，虽然去过一次，但是很想再去一次。
王一飞：不错，到中国后你就可以经常说中文了。`,lines:[{name:"王一飞",zh:"考试就要开始了，请大家写上姓名，写好后就可以做题了。",py:"Kǎoshì jiù yào kāishǐ le, qǐng dàjiā xiě shàng xìngmíng, xiě hǎo hòu jiù kěyǐ zuò tí le.",en:"The exam is about to start—please write your name, and once you've done that you can start the questions."},{name:"",zh:"……",py:"",en:""},{name:"白家月",zh:"老师，我做完了。",py:"Lǎoshī, wǒ zuòwán le.",en:"Teacher, I'm finished."},{name:"陈天中",zh:"老师，我也做完了。",py:"Lǎoshī, wǒ yě zuòwán le.",en:"Teacher, I'm done too."},{name:"王一飞",zh:"……对了，你们考完试想做什么？",py:"…… Duì le, nǐmen kǎo wán shì xiǎng zuò shénme?",en:"…By the way, what do you want to do after the exam?"},{name:"白家月",zh:"我很想去中国，虽然去过一次，但是很想再去一次。",py:"Wǒ hěn xiǎng qù Zhōngguó, suīrán qùguo yí cì, dànshì hěn xiǎng zài qù yí cì.",en:"I really want to go to China—though I've been once, I'd love to go again."},{name:"王一飞",zh:"不错，到中国后你就可以经常说中文了。",py:"Búcuò, dào Zhōngguó hòu nǐ jiù kěyǐ jīngcháng shuō Zhōngwén le.",en:"Nice—once in China you'll get to speak Chinese often."}],vocab:{seg:[{t:"王一飞：考试就要开始了，请大家写上"},{b:1},{t:`，写好后就可以做题了。
……
白家月：老师，我做完了。
陈天中：老师，我也做完了。
王一飞：……对了，你们考完试想做什么？
白家月：我很想去中国，虽然去过一次，但是很想再去一次。
王一飞：不错，到中国后你就可以经常说中文了。`}],answers:["姓名"],tiles:{姓名:{py:"xìngmíng",en:"full name"}}},grammar:{before:`王一飞：考试就要开始了，请大家写上姓名，写好后就可以做题了。
……
白家月：老师，我做完了。
陈天中：老师，我也做完了。
王一飞：……对了，你们考完试想做什么？
白家月：我很想去中国，`,after:`。
王一飞：不错，到中国后你就可以经常说中文了。`,answer:"虽然去过一次，但是很想再去一次",tokens:["虽然","去过","一次","但是","很","想","再","去","一次"]},sentences:[{speaker:"白家月",text:"老师，我做完了。",tokens:["老师","我","做","完","了"]},{speaker:"陈天中",text:"老师，我也做完了。",tokens:["老师","我","也","做","完","了"]},{speaker:"王一飞",text:"……对了，你们考完试想做什么？",tokens:["对了","你们","考","完","试","想","做","什么"]},{speaker:"白家月",text:"我很想去中国，虽然去过一次，但是很想再去一次。",tokens:["我","很","想","去","中国","虽然","去过","一次","但是","很","想","再","去","一次"]},{speaker:"王一飞",text:"不错，到中国后你就可以经常说中文了。",tokens:["不错","到","中国","后","你","就","可以","经常","说","中文","了"]}],note:"动量补语（1）；动量补语（2）；“有”字句（2）"},{n:2,title:"课文2",original:`白家月：考完试了，我现在可以出国旅游了。
李文：你要去哪儿？
白家月：我要再去一次北京。
李文：为什么还去北京？
白家月：因为我想再吃一次烤鸭，再喝一次奶茶，再去北京大学看一次电影……
李文：你想做的事情很多啊！
白家月：是啊，你看，我还在网上买好颐和园的门票了呢。
李文：我的高中同学就在颐和园上班，可以让他给你好好介绍介绍。
白家月：太好了！出门旅游，多个朋友多条路。`,lines:[{name:"白家月",zh:"考完试了，我现在可以出国旅游了。",py:"Kǎo wán shì le, wǒ xiànzài kěyǐ chū guó lǚyóu le.",en:"The exams are over—now I can travel abroad."},{name:"李文",zh:"你要去哪儿？",py:"Nǐ yào qù nǎr?",en:"Where are you going?"},{name:"白家月",zh:"我要再去一次北京。",py:"Wǒ yào zài qù yí cì Běijīng.",en:"I'm going to Beijing again."},{name:"李文",zh:"为什么还去北京？",py:"Wèishénme hái qù Běijīng?",en:"Why Beijing again?"},{name:"白家月",zh:"因为我想再吃一次烤鸭，再喝一次奶茶，再去北京大学看一次电影……",py:"Yīnwèi wǒ xiǎng zài chī yí cì kǎoyā, zài hē yí cì nǎichá, zài qù Běijīng Dàxué kàn yí cì diànyǐng……",en:"Because I want to eat Peking duck again, have milk tea again, and watch a movie at Peking University again…"},{name:"李文",zh:"你想做的事情很多啊！",py:"Nǐ xiǎng zuò de shìqing hěn duō a!",en:"You've got a lot you want to do!"},{name:"白家月",zh:"是啊，你看，我还在网上买好颐和园的门票了呢。",py:"Shì a, nǐ kàn, wǒ hái zài wǎng shàng mǎihǎo Yíhéyuán de ménpiào le ne.",en:"Yeah—look, I've even bought Summer Palace tickets online already."},{name:"李文",zh:"我的高中同学就在颐和园上班，可以让他给你好好介绍介绍。",py:"Wǒ de gāozhōng tóngxué jiù zài Yíhéyuán shàngbān, kěyǐ ràng tā gěi nǐ hǎohǎo jièshào jièshào.",en:"My high school classmate works at the Summer Palace—I can have him show you around."},{name:"白家月",zh:"太好了！出门旅游，多个朋友多条路。",py:"Tài hǎo le! Chūmén lǚyóu, duō ge péngyou duō tiáo lù.",en:"Great! When traveling, an extra friend means an extra way to get by."}],vocab:{seg:[{t:"白家月：考完试了，我现在可以"},{b:1},{t:`旅游了。
李文：你要去哪儿？
白家月：我要再去一次北京。
李文：为什么还去北京？
白家月：因为我想再吃一次烤鸭，再喝一次奶茶，再去北京大学看一次电影……
李文：你想做的事情很多啊！
白家月：是啊，你看，我还在网上买好颐和园的`},{b:2},{t:`了呢。
李文：我的`},{b:3},{t:`同学就在颐和园上班，可以让他给你好好介绍介绍。
白家月：太好了！`},{b:4},{t:"旅游，多个朋友多条"},{b:5},{t:"。"}],answers:["出国","门票","高中","出门","路"],tiles:{出国:{py:"chūguó",en:"to go abroad"},门票:{py:"ménpiào",en:"entrance ticket"},高中:{py:"gāozhōng",en:"high school"},出门:{py:"chūmén",en:"to leave home; go out"},路:{py:"lù",en:"road; way"}}},grammar:{before:`白家月：考完试了，我现在可以出国旅游了。
李文：你要去哪儿？
白家月：我要再去一次北京。
李文：为什么还去北京？
白家月：因为我想`,after:`，再喝一次奶茶，再去北京大学看一次电影……
李文：你想做的事情很多啊！
白家月：是啊，你看，我还在网上买好颐和园的门票了呢。
李文：我的高中同学就在颐和园上班，可以让他给你好好介绍介绍。
白家月：太好了！出门旅游，多个朋友多条路。`,answer:"再吃一次烤鸭",tokens:["再","吃","一次","烤鸭"]},sentences:[{speaker:"白家月",text:"考完试了，我现在可以出国旅游了。",tokens:["考","完","试","了","我","现在","可以","出国","旅游","了"]},{speaker:"白家月",text:"出门旅游，多个朋友多条路。",tokens:["出门","旅游","多","个","朋友","多","条","路"]},{speaker:"李文",text:"你要去哪儿？",tokens:["你","要","去","哪儿"]},{speaker:"白家月",text:"我要再去一次北京。",tokens:["我","要","再","去","一次","北京"]},{speaker:"李文",text:"为什么还去北京？",tokens:["为什么","还","去","北京"]},{speaker:"李文",text:"你想做的事情很多啊！",tokens:["你","想","做","的","事情","很多","啊"]},{speaker:"白家月",text:"太好了！",tokens:["太","好","了"]}],note:"动量补语（1）；动量补语（2）；“有”字句（2）"},{n:3,title:"课文3",original:`白家月：李文，你有一年没回国了吧？
李文：不到一年。我六月的时候回去了一次。
白家月：我怎么忘了？还是我送你去的机场呢。
李文：是啊。
白家月：我记得你那次的机票很便宜。
李文：没错，可能因为那个时候去北京的人不多吧。
白家月：这次的机票虽然有点儿贵，但是想到就要飞北京了，我还是很高兴的。`,lines:[{name:"白家月",zh:"李文，你有一年没回国了吧？",py:"Lǐ Wén, nǐ yǒu yì nián méi huí guó le ba?",en:"Li Wen, it's been a year since you went back home, hasn't it?"},{name:"李文",zh:"不到一年。我六月的时候回去了一次。",py:"Bú dào yì nián. Wǒ liù yuè de shíhou huíqu le yí cì.",en:"Less than a year. I went back once in June."},{name:"白家月",zh:"我怎么忘了？还是我送你去的机场呢。",py:"Wǒ zěnme wàng le? Háishi wǒ sòng nǐ qù de jīchǎng ne.",en:"How did I forget? I'm the one who took you to the airport."},{name:"李文",zh:"是啊。",py:"Shì a.",en:"That's right."},{name:"白家月",zh:"我记得你那次的机票很便宜。",py:"Wǒ jìde nǐ nà cì de jīpiào hěn piányi.",en:"I remember your ticket that time was cheap."},{name:"李文",zh:"没错，可能因为那个时候去北京的人不多吧。",py:"Méicuò, kěnéng yīnwèi nàge shíhou qù Běijīng de rén bù duō ba.",en:"Right—probably because not many people were going to Beijing then."},{name:"白家月",zh:"这次的机票虽然有点儿贵，但是想到就要飞北京了，我还是很高兴的。",py:"Zhè cì de jīpiào suīrán yǒudiǎnr guì, dànshì xiǎngdào jiù yào fēi Běijīng le, wǒ háishi hěn gāoxìng de.",en:"This time the ticket's a bit pricey, but thinking about flying to Beijing soon, I'm still happy."}],vocab:{seg:[{t:"白家月：李文，你有一年没"},{b:1},{t:`了吧？
李文：不到一年。我`},{b:2},{t:`的时候回去了一次。
白家月：我怎么忘了？还是我送你去的`},{b:3},{t:`呢。
李文：是啊。
白家月：我记得你那次的`},{b:4},{t:"很"},{b:5},{t:`。
李文：没错，可能因为那个时候去北京的人不多吧。
白家月：这次的机票虽然有点儿贵，但是想到就要`},{b:6},{t:"北京了，我还是很高兴的。"}],answers:["回国","六月","机场","机票","便宜","飞"],tiles:{回国:{py:"huíguó",en:"to return to one's home country"},六月:{py:"liù yuè",en:"June"},机场:{py:"jīchǎng",en:"airport"},机票:{py:"jīpiào",en:"air ticket"},便宜:{py:"piányi",en:"cheap"},飞:{py:"fēi",en:"to fly"}}},grammar:{before:"白家月：李文，你",after:`吧？
李文：不到一年。我六月的时候回去了一次。
白家月：我怎么忘了？还是我送你去的机场呢。
李文：是啊。
白家月：我记得你那次的机票很便宜。
李文：没错，可能因为那个时候去北京的人不多吧。
白家月：这次的机票虽然有点儿贵，但是想到就要飞北京了，我还是很高兴的。`,answer:"有一年没回国了",tokens:["有","一年","没","回国","了"]},sentences:[{speaker:"白家月",text:"李文，你有一年没回国了吧？",tokens:["李文","你","有","一年","没","回国","了","吧"]},{speaker:"李文",text:"我六月的时候回去了一次。",tokens:["我","六月","的","时候","回去","了","一次"]},{speaker:"白家月",text:"还是我送你去的机场呢。",tokens:["还是","我","送","你","去","的","机场","呢"]},{speaker:"白家月",text:"我记得你那次的机票很便宜。",tokens:["我","记得","你","那","次","的","机票","很","便宜"]},{speaker:"李文",text:"不到一年。",tokens:["不到","一年"]},{speaker:"白家月",text:"我怎么忘了？",tokens:["我","怎么","忘","了"]},{speaker:"李文",text:"是啊。",tokens:["是","啊"]},{speaker:"李文",text:"没错，可能因为那个时候去北京的人不多吧。",tokens:["没","错","可能","因为","那个","时候","去","北京","的","人","不","多","吧"]}],note:"动量补语（1）；动量补语（2）；“有”字句（2）"},{n:4,title:"课文4",original:"六月的时候回过一次北京，现在有半年多没回去了，我有点儿想家。就要过年了，我要回家过年。家月这次也要去北京，我们都是星期五的飞机。家月说我们好像小鸟，一起飞到北京，再一起飞回这里。",lines:[{name:"",zh:"六月的时候回过一次北京，现在有半年多没回去了，我有点儿想家。就要过年了，我要回家过年。家月这次也要去北京，我们都是星期五的飞机。家月说我们好像小鸟，一起飞到北京，再一起飞回这里。",py:"Liù yuè de shíhou huíguo yí cì Běijīng, xiànzài yǒu bàn nián duō méi huíqu le, wǒ yǒudiǎnr xiǎng jiā. Jiù yào guònián le, wǒ yào huí jiā guònián. Jiāyuè zhè cì yě yào qù Běijīng, wǒmen dōu shì xīngqīwǔ de fēijī. Jiāyuè shuō wǒmen hǎoxiàng xiǎo niǎo, yìqǐ fēi dào Běijīng, zài yìqǐ fēi huí zhèlǐ.",en:"I went back to Beijing once in June, and now it's been over half a year—I'm a little homesick. New Year's coming, so I'll go home for it. Jiayue is also going to Beijing this time; we both have Friday flights. Jiayue says we're like little birds, flying to Beijing together and then flying back here together."}],vocab:{seg:[{t:"六月的时候回过一次北京，现在有"},{b:1},{t:"多没回去了，我有点儿"},{b:2},{t:"。就要"},{b:3},{t:"了，我要回家过年。家月这次也要去北京，我们都是星期五的飞机。家月说我们"},{b:4},{b:5},{t:"，一起飞到北京，再一起飞回这里。"}],answers:["半年","想家","过年","好像","小鸟"],tiles:{半年:{py:"bàn nián",en:"half a year"},想家:{py:"xiǎng jiā",en:"to be homesick"},过年:{py:"guònián",en:"to celebrate Spring Festival"},好像:{py:"hǎoxiàng",en:"to seem; be like"},小鸟:{py:"xiǎo niǎo",en:"little bird"}}},grammar:{before:"六月的时候回过一次北京，现在",after:"，我有点儿想家。就要过年了，我要回家过年。家月这次也要去北京，我们都是星期五的飞机。家月说我们好像小鸟，一起飞到北京，再一起飞回这里。",answer:"有半年多没回去了",tokens:["有","半年","多","没","回去","了"]},sentences:[{speaker:"",text:"就要过年了，我要回家过年。",tokens:["就要","过年","了","我","要","回家","过年"]},{speaker:"",text:"家月说我们好像小鸟，一起飞到北京，再一起飞回这里。",tokens:["家","月","说","我们","好像","小鸟","一起","飞","到","北京","再","一起","飞","回","这里"]},{speaker:"",text:"家月这次也要去北京，我们都是星期五的飞机。",tokens:["家","月","这","次","也","要","去","北京","我们","都","是","星期五","的","飞机"]}],note:"动量补语（1）；动量补语（2）；“有”字句（2）"}]}],s={series:e,unit:2,lessons:n};export{s as default,n as lessons,e as series,t as unit};
