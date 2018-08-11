import { RUIRect, RUICLIP_MAX, RUIRectP } from "./RUIObject";
import { RUIRoot } from "./RUIRoot";
import { UIUtil } from "./UIUtil";
import { RUIColor } from "./RUIColor";
import { RUI } from "./RUI";

export enum RUIDrawCmdType {
    rect,
    text,
    border,
    line
}

export class RUIDrawCmd{
    public Rect: number[] = [];
    public Color: number[];
    public Text: string;
    public clip: RUIRectP;

    public Index:number = 0;

    public type: RUIDrawCmdType = RUIDrawCmdType.rect;



    
    public constructor(rect?: number[]) {
        this.Rect = rect;
    }

    public static CmdRect(rect: number[], color: number[]): RUIDrawCmd {
        let cmd = new RUIDrawCmd();
        cmd.Rect = rect;
        cmd.Color = color;
        return cmd;
    }

    public static CmdText(text: string, cliprect: number[], color?: number[]) {
        let cmd = new RUIDrawCmd();
        cmd.Text = text;
        cmd.Rect = cliprect;
        cmd.Color = color;
        cmd.type = RUIDrawCmdType.text;
        return cmd;
    }

    public static CmdBorder(rect: number[], color: number[]): RUIDrawCmd {
        let cmd = new RUIDrawCmd();
        cmd.Rect = rect;
        cmd.Color = color;
        cmd.type = RUIDrawCmdType.border;
        return cmd;
    }

    public static CmdLine(x1: number, y1: number, x2: number, y2: number, color: number[]) {
        let cmd = new RUIDrawCmd();
        cmd.Rect = [x1, y1, x2, y2];
        cmd.Color = color;
        cmd.type = RUIDrawCmdType.line;
        return cmd;
    }
}

export class RUICmdList{


    public drawList: RUIDrawCmd[] = [];
    public MaxDrawCount:number = 1000;

    public isDirty:boolean = false;

    private m_clipStack :RUIRectP[] = [];
    private m_clipRect :RUIRectP = null;


    public draw(root: RUIRoot){

        this.drawList = [];
        this.m_clipStack = [];
        let rootrect=  root.rootRect;
        this.m_clipRect = rootrect == null ? RUICLIP_MAX : rootrect;
        root.root.onDraw(this);
        
        this.isDirty = true;
    }


    public DrawRect(x: number, y: number, w: number, h: number) {
        let cmd = new RUIDrawCmd([x, y, w, h]);
        cmd.clip = this.m_clipRect;
        this.drawList.push();
    }

    public DrawRectWithColor(pos: number[], color: number[]) {
        let cmd = new RUIDrawCmd(pos);
        cmd.clip = this.m_clipRect;
        cmd.Color = color;
        this.drawList.push(cmd);
    }

    public DrawText(text: string, clirect:RUIRect, color?: number[]) {
        let clip = clirect.slice(0);
        clip[2] += clip[0];
        clip[3] += clip[1];
        clip = RUI.RectClipP(clip,this.m_clipRect);

        if(clip != null){
            let cmd = RUIDrawCmd.CmdText(text, clirect, color);
            cmd.clip =clip;
            if(text === 'A') console.log("A>>" + this.m_clipRect);
            this.drawList.push(cmd);
        }
        else{
            throw new Error();
        }
        
        
        //this.DrawBorder(clirect,RUIColor.Red);
    }

    public DrawBorder(rect: number[], color: number[]) {
        let cmd = RUIDrawCmd.CmdBorder(rect, color);
        cmd.clip = this.m_clipRect;
        this.drawList.push(cmd);
    }

    public DrawLine(x1: number, y1: number, x2: number, y2: number, color: number[]) {
        let cmd = RUIDrawCmd.CmdLine(x1,y1,x2,y2,color);
        cmd.clip = this.m_clipRect;
        this.drawList.push(cmd);
    }

    public PushClipRect(rect?:RUIRect,nested? :boolean){
        let clip  = null;
        if(rect == null){
            clip = RUICLIP_MAX;
        }
        else{
           clip = [rect[0],rect[1],rect[0] + rect[2],rect[1]+ rect[3]];
        }

        if(nested == true && this.m_clipRect != null ){
            clip = RUI.RectClipP(clip,this.m_clipRect);

            if(clip == null){
                throw new Error();
            }
        }
        
        this.m_clipStack.push(this.m_clipRect);
        this.m_clipRect = clip;
    }

    public PopClipRect(): RUIRect{
        this.m_clipRect = this.m_clipStack.pop();
        return this.m_clipRect;
    }
}