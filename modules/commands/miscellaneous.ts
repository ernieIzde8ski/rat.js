import { Bot, Context } from "../commands";
import { ArgumentParsingError } from "../errors"; 

/** TODO: Local time command */
module.exports = {
    cmds: [{
        name: "birana", desc: "Returns armenium birana status",
        func: async (bot: Bot, ctx: Context) => {
            const armenium = (ctx.args.shift() ?? "Armenium").toUpperCase();
            const armeniaum = (ctx.args.shift() ?? "Armeniaum").toUpperCase();
            await ctx.send(`SHUT THE FUCK UP ${armenium} , WHAT WOULD YOU KNOW ABOUT WHETHER A WORD IS FUNNY OR NOT ? YOU KNOWING OF NOTHING !!! YOU ARE STUPID , STUPID LITTLE CRYBABY KID , WHO LIFT THE 50 TIME 15 BOUND (VERY LITTLE WEIGHT , VERY LUGHT) , YOU ARE WEAK , AND PAINFUL , IT SUCKS TO BE YOU !!! "${armeniaum}" IS A SCHIT, SUCK COUNTRY BUILT OF BAD AND TERRIBLE KIDS , LIKE YOU RSELF, YOUR CULTURE SUCK, YOUR HERITAGE, , IT IS BAD ,AND YOUR CHOICE ??? TERRIBLE ABSOLUTE LY WAFUL. "BIRANA" WELL DESCRIBES THE ABSOLUTE DIFFERENCE OSPOSITE OF YOU, AND YOUR EVERY THING , BECAUSE "BIRANA" BAED YOU ARE CIRNGE. BIRANA "BASED" YOU ARE "CRINGE".`
            }
    }, {
        name: "NSBM", aliases=["nsbm"],
        func: async (bot: Bot, ctx: Context) => {
            await ctx.send("https://cdn.discordapp.com/attachments/404758309418172436/876620413701062727/ymq2us28roi61.png");
        }
    }]
}
