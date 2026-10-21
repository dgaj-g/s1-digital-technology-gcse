#!/usr/bin/env python3
"""Builds content/chNN.json and content/index.json. Chapters 0 and 7 are written here; every other chapter is tools/chapters/chNN.py,
run with these helpers and defining CH. Stage lists of unbuilt chapters come from the briefs in DESIGN_SPEC.md §9.
Run: python3 -I s2-u5ca-guide/tools/build_content.py"""
import struct, json, re, os
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.dirname(HERE)
CODE = os.path.join(D, 'content', 'code')

def lines(form, method):
    return open(os.path.join(CODE, form, method + '.cs')).read().rstrip('\n').split('\n')

def slice_(form, method, a, b):
    return '\n'.join(lines(form, method)[a-1:b])

def code(id_, title, where, form, method, a, b, parts, names, isense, **kw):
    """A typed block: lines a..b of the method file; parts = [[from,to,heading,meaning,(given)]] in file line numbers."""
    blk = {"id": id_, "kind": "type", "title": title, "where": where, "form": form, "method": method,
           "lang": "cs", "from": a, "to": b, "text": slice_(form, method, a, b), "partLines": parts,
           "names": names, "isense": isense}
    blk.update(kw); return {"code": blk}

GIVEN2 = ["Visual Studio wrote these two lines", "Leave them as they are. Your code goes between the curly brackets.", "given"]
GIVEN1 = ["Visual Studio wrote this line", "This curly bracket is the end. Your code goes above it.", "given"]
def given(a, b): return [a, b] + (GIVEN2 if b > a else GIVEN1)

def step(id_, do, see, img=None, wrong=None):
    s = {"id": id_, "do": do, "see": see}
    if img: s["img"] = img
    if wrong: s["wrong"] = wrong
    return s
def cap(name, alt, w=1280, h=800, marks=None):
    f = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'content', 'img', 'cap', name + '.png')
    if os.path.exists(f):   # a real capture: its own size (PNG header bytes 16-24)
        w, h = struct.unpack('>II', open(f, 'rb').read(24)[16:24])
    d = {"img": "img/cap/" + name + ".png", "alt": alt, "w": w, "h": h}
    if marks: d["marks"] = marks
    return d
def frames(fid, title, fr, watch=None):
    d = {"id": fid, "title": title, "frames": [dict(cap(n, alt), say=say) for n, alt, say in fr]}
    if watch: d["watch"] = watch
    return {"frames": d}
def have(id_, what, how, fix, go):
    return {"id": id_, "what": what, "how": how, "fix": fix, "go": go, "expect": "have"}
def tryit(id_, what, how, fix, go, neg=False, design=False, code=False):
    r = {"id": id_, "what": what, "how": how, "fix": fix, "go": go, "expect": "mustnot" if neg else "must"}
    if design: r["on"] = "design"   # checked in the Design tab, not the running program
    if code: r["on"] = "code"       # tried in the code tab and the Build menu, the program is not run
    return r

# ------------------------------------------------------------------ chapter 7
Q = 'frmQuiz'
QL = {"pnlQuizScore": "the score", "pnlTextQuestion": "question 1", "pnlButtonsQuestion": "question 2",
      "pnlListQuestion": "question 3", "pnlRadioQuestion": "question 4", "pnlNumberQuestion": "question 5"}
DL = {"pnlPupilDetails": "pupil details", "pnlSwimLengths": "the three attempts", "pnlQuizResult": "the quiz score", "pnlReactionTest": "the test score", "pnlSwimmingGroup": "the group"}
def opener(title, goal, what, does):
    """The first screen of a part with two or more steps: names the whole act before any step (EASE_SPEC §1)."""
    return {"id": "0", "title": title, "opener": True, "foot": "next", "goal": goal, "blocks": [{"open": {"what": what, "does": does}}]}
ch7 = {
 "id": "07", "n": 7, "of": 15, "title": "The quiz: questions 4 and 5, and the score", "kind": "new", "color": "#0F9D8A", "noTurn": True,
 "one": "Only question 1 works at the start, mark questions 4 and 5, send the score back.",
 "prev": {"id": "06", "n": 6, "title": "The quiz: the first three questions"},
 "next": {"id": "08", "n": 8, "title": "The data entry form: its Load event"},
 "methods": [["frmQuiz", "frmQuiz_Load"], ["frmQuiz", "btnCheck4_Click"], ["frmQuiz", "btnCheck5_Click"], ["frmQuiz", "btnReturn_Click"]],
 "stages": [
  {"id": "1", "title": "Check your quiz has what it needs", "thing": "the quiz form you already have", "verb": "checking", "screens": [
   {"id": "1", "title": "Check your quiz has what it needs", "foot": "have",
    "done": "every row is ticked, or you have gone where its link says",
    "goal": "Before I code the rest of the quiz, I check I have the question 4 and 5 panels, the Return button, question 3's code and the two things in Global.cs.",
    "blocks": [
    {"p": "Before you code the rest of the quiz, tick each row you already have."},
    {"p": "Open your project in Visual Studio, in the Programming Environment tab, and look. A row you have not got tells you where to go."},
    {"check": [
     have("1-1.t1", "Open frmQuiz in the Design tab. Does question 4 have a group box, four radio buttons and a Check button?",
          "In my example it is the panel on the right of the middle row. In yours, look for the panel with the radio buttons.", "Go to chapter 6, part 2.", "#cw/06/2-1"),
     have("1-1.t2", "Does question 5 have a number box and a Check button?",
          "In my example it is the wide panel along the bottom. Yours may be somewhere else. Look for the number box.", "Go to chapter 6, part 2.", "#cw/06/2-1"),
     have("1-1.t3", "Is there a Return button in the score panel?",
          "In my example it is near the bottom of the tall panel on the left. Yours is in your score panel.", "Go to chapter 6, part 2.", "#cw/06/2-1"),
     have("1-1.t4", "Double-click question 3's Check button. Is there code between its two curly brackets?",
          "The code tab opens at the code behind that button. Lines between the curly brackets mean yes.", "Go to chapter 6, part 5.", "#cw/06/5-1"),
     have("1-1.t5", "Open Global.cs. Are quizScore and quizTaken in it? quizScore counts the right answers. quizTaken remembers whether the quiz has been done.",
          "Solution Explorer is on the right. Double-click Global.cs to open it. Look for the two lines with those names.", "Go to chapter 3, part 3.", "#cw/03/3-1")]},
    {"box": {"title": "Not sure where to look?", "fold": True,
             "text": "Solution Explorer is on the right of Visual Studio 2019. It lists every form. Double-click frmQuiz to see it in the Design tab. Right-click it and choose View Code to see its code."}}
   ]}]},
  {"id": "2", "title": "Make only question 1 work when the quiz opens", "thing": "what happens when the quiz opens", "verb": "making", "screens": [
   opener("Make the quiz open with only question 1 working",
          "This part gives the quiz a Load event, so that only question 1 can be clicked when the quiz opens.",
          "The Load event is code that runs by itself the moment the quiz form opens. Nobody clicks it.",
          "When it works, only question 1 can be clicked when the quiz opens. Questions 2 to 5 are grey and the Return button is hidden."),
   {"id": "1", "title": "Meet the Load event", "foot": "next",
    "done": "you can say what a Load event is in your own words",
    "goal": "A Load event is code that runs by itself the moment the form opens, before anyone clicks anything.",
    "blocks": [
    {"p": "Right now the quiz opens with all five questions clickable, which the Load event fixes."},
    {"words": [
      ["Load event", "Code that runs by itself the moment the form opens, before anyone clicks anything.", "2-1", True],
      [".Checked", "Tells you if a radio button's dot is filled in. True if it is, false if it is not.", "3-1", True],
      ["return;", "Stop here. Nothing under this line runs.", "3-4", True],
      [".Value", "The number showing in a number box.", "4-1", True]],
     "intro": "Four new things in this chapter. Click any marked word to see what it means."},
    {"p": "A [[Load event|0]] runs by itself the moment the form opens. Nobody clicks it. You have not used one yet, and the quiz needs one."},
    {"watch": "A Load event is not a button. Nobody clicks it. It runs by itself when the form opens."}
   ]},
   {"id": "2", "title": "See what the Load event will do", "foot": "next",
    "done": "you know the Load event runs by itself, before any click",
    "goal": "The Load event runs the moment the quiz form opens, before any click, and every form can have one.",
    "blocks": [
    {"p": "Watch the quiz form open and its Load event run before anyone has clicked."},
    {"drawn": {"id": "load-now", "alt": "The quiz form slides in. A code card lights up under it with the words runs now.",
               "say": "The quiz form opens. Its Load event runs straight away. Nobody has clicked anything."}},
    {"p": "Every form can have a Load event if you want one. The quiz needs one, so that is where you write your first."},
    {"watch": "Nothing is clicked. The Load event runs by itself."}
   ]},
   {"id": "3", "title": "Double-click the form to open its Load code", "foot": "done",
    "done": "the code tab is open at frmQuiz_Load with your cursor between its curly brackets",
    "goal": "To make a Load event I double-click the form itself, not a control on it, and Visual Studio writes frmQuiz_Load for me.",
    "blocks": [
    {"p": "Visual Studio makes the Load event for you when you double-click the form itself."},
    {"steps": [
     step("2-2.1", "Open frmQuiz in the Design tab.",
          "You can see the quiz form with its panels.", cap("f4-1", "The quiz form open in the Design tab")),
     step("2-2.2", "Double-click the form itself. The title bar at the top of the form is the safest spot.",
          "The code tab opens. Visual Studio has written frmQuiz_Load for you, with two curly brackets.", cap("f4-2", "The pointer on the title bar of the quiz form in the Design tab"),
          [["I got a panel's code or a button's code instead.", "You double-clicked a control, not the form. Go back to the Design tab and double-click the form's title bar."]]),
     step("2-2.3", "Look where your cursor is blinking.",
          "It is between the two curly brackets of frmQuiz_Load. That is where your code goes.", cap("f4-3", "The code tab with the new empty frmQuiz_Load and the cursor between its curly brackets"))]},
    {"watch": "Double-click the FORM, not a panel or a button. Double-clicking a button gives you that button's code instead."}
   ]},
   {"id": "4", "title": "See why only question 1 can be clicked", "foot": "next",
    "done": "you can name the four panels the Load event switches off",
    "goal": "When the quiz opens, question 1 works and questions 2 to 5 are switched off and grey, so they get answered in order.",
    "blocks": [
    {"p": "Here is what the quiz should look like the moment it opens."},
    {"flow": {"form": "frmQuiz", "lit": ["pnlQuizScore", "pnlTextQuestion"], "then": [], "labels": QL,
              "watch": "four grey panels, and no Return button",
              "say": "Only question 1 and the score are on. The rest are grey."}},
    {"p": "Each question sits in its own panel. A switched-off panel goes grey, and nothing in it can be clicked."},
    {"p": "So the Load event has two jobs. Switch off the four panels for questions 2 to 5. Hide the Return button until the quiz is over."},
    {"watch": "Count them: four panels to switch off, and one Return button to hide."}
   ]},
   {"id": "5", "title": "Type the code that switches off questions 2 to 5", "foot": "done",
    "done": "lines 3 to 8 are typed and the code has no red squiggles",
    "goal": "In frmQuiz_Load I set Enabled to false on the four panels and Visible to false on the Return button.",
    "blocks": [
    {"p": "Now type the Load event's code: four panels switched off and one button hidden."},
    code("2-4.c1", "The quiz's Load event", "between the curly brackets of frmQuiz_Load, in frmQuiz.cs", Q, "frmQuiz_Load", 1, 9,
         [given(1, 2),
          [3, 7, "Switch off questions 2 to 5", "The line that starts with two slashes is a note for you. The computer skips it. Then one line per panel. Enabled = false switches the panel off and turns it grey."],
          [8, 8, "Hide the Return button", "Visible = false hides the button. Question 5's Check button brings it back at the end."],
          given(9, 9)],
         ["pnlButtonsQuestion", "pnlListQuestion", "pnlRadioQuestion", "pnlNumberQuestion", "btnReturn"],
         ["pnlButtonsQuestion", "pnlListQuestion", "pnlRadioQuestion", "pnlNumberQuestion", "btnReturn"]),
    {"box": {"title": "See the real IntelliSense list", "fold": True, "blocks": [
      frames("F3", "IntelliSense in Visual Studio 2019", [
        ("f3-1", "The code tab with pnl typed on a new line", "Type the first letters of the name."),
        ("f3-2", "The IntelliSense list open under pnl, showing the six panel names", "The list pops up with every matching name in YOUR program."),
        ("f3-3", "The line completed to pnlButtonsQuestion", "Press Tab. The name is typed for you, spelt right.")],
        watch="the list, then the name typed for you")]}},
    {"watch": "Four panels get Enabled = false. The Return button gets Visible = false, which hides it."}
   ]}]},
  {"id": "3", "title": "Mark question 4, the one with radio buttons", "thing": "question 4's Check button", "verb": "making", "screens": [
   opener("Make question 4's Check button work",
          "This part writes the code behind question 4's Check button: stop if nothing is chosen, mark the answer, move on to question 5.",
          "Question 4 has four radio buttons and a Check button. The code behind that Check button marks the answer.",
          "When it works, Check marks the answer, switches question 4 off and switches question 5 on. With no dot filled in, it shows a message instead."),
   {"id": "1", "title": "See how code tells which radio button is chosen", "foot": "next",
    "done": "you can read rbB.Checked and !rbA.Checked out loud in words",
    "goal": "rbB.Checked is true when B's dot is filled in, and an exclamation mark in front means NOT.",
    "blocks": [
    {"p": "Before you type, see how code asks a radio button whether its dot is filled in."},
    {"code": {"id": "3-1.r1", "kind": "read", "snippet": True, "title": "Two ways to ask a radio button", "lang": "cs",
              "text": "rbB.Checked\n!rbA.Checked",
              "partLines": [[1, 1, "Is B chosen?", "True when the dot of rbB is filled in."],
                            [2, 2, "Is A NOT chosen?", "The exclamation mark means NOT. True when the dot of rbA is empty."]],
              "names": ["rbA", "rbB"], "isense": []}},
    {"p": "Every radio button has [[.Checked|1]]. It is true when the dot is filled in. In my example the radio buttons are rbA, rbB, rbC and rbD. Yours have the names you gave them."},
    {"watch": "An exclamation mark in front means NOT. Read !rbA.Checked as: A is not chosen."}
   ]},
   {"id": "2", "title": "Find question 4's Check button on the form", "foot": "next",
    "done": "you can point to question 4's Check button in the Design tab",
    "goal": "Question 4's code lives behind its Check button, and double-clicking that button in the Design tab opens the code.",
    "blocks": [
    {"p": "Everything question 4 does happens when its Check button is clicked, so first find that button."},
    frames("F1", "Opening the code behind a button", [
      ("f1-1", "The quiz form in the Design tab, with the pointer on question 4's Check button", "In the Design tab, double-click the button."),
      ("f1-2", "The code tab with a new empty btnCheck4_Click", "The code tab opens. Visual Studio wrote the first and last lines.")],
      watch="the pointer on the button, then the empty code")
   ]},
   {"id": "3", "title": "Double-click question 4's Check button", "foot": "done",
    "done": "the code tab is open at btnCheck4_Click, empty between the curly brackets",
    "goal": "Double-clicking a button in the Design tab opens the code behind that button.",
    "blocks": [
    {"p": "Now open the code behind question 4's Check button."},
    {"steps": [step("3-2.1", "In the Design tab of frmQuiz, double-click question 4's Check button.",
                    "The code tab opens at btnCheck4_Click. It is empty between the curly brackets.")]},
    {"watch": "Double-click the button itself, not the panel around it. The panel would give you code you do not want."}
   ]},
   {"id": "4", "title": "See why the code must stop when nothing is chosen", "foot": "next",
    "done": "you can say what return does when no dot is filled in",
    "goal": "If none of the four dots is filled in, the code shows a message and return stops it, so nothing else runs.",
    "blocks": [
    {"p": "Think about a pupil who clicks Check without choosing an answer."},
    {"p": "An empty answer should not be marked. So the first thing the Check button does is look at all four dots. If none is filled in, it shows a message and stops."},
    {"drawn": {"id": "stop-sign", "alt": "A stop sign drops onto the return line of the code.",
               "say": "The stop sign lands on return. Nothing under this line runs."}},
    {"p": "[[return;|2]] means stop here. When nothing is chosen, nothing under that line runs."},
    {"watch": "Each && means AND. All four dots must be empty for the message to show."}
   ]},
   {"id": "5", "title": "Type the check for no radio button chosen", "foot": "done",
    "done": "lines 3 to 8 are typed with no red squiggles",
    "goal": "I type the if that asks whether all four dots are empty, shows a message and returns.",
    "blocks": [
    {"p": "Type the four-dot check: show a message and stop when no dot is filled in."},
    code("3-3.c1", "Question 4's Check button: code 1 of 3", "between the curly brackets of btnCheck4_Click, in frmQuiz.cs", Q, "btnCheck4_Click", 1, 8,
         [given(1, 2),
          [3, 8, "No dot filled in? Show a message and stop", "The if line asks: are all four dots empty? If they are, a message pops up. Then return stops the code here."]],
         ["rbA", "rbB", "rbC", "rbD"], ["rbA"]),
    {"watch": "In my example the dots are rbA, rbB, rbC and rbD. Use the names of YOUR four radio buttons."}
   ]},
   {"id": "6", "title": "Add 1 to the score if the answer is right", "foot": "done",
    "done": "lines 9 to 19 are typed, using YOUR right radio button's name",
    "goal": "If the right radio button is chosen the score goes up by 1 and the group box turns green, otherwise it turns red.",
    "blocks": [
    {"p": "Now type the marking: the right dot scores 1, any other dot turns the box red."},
    code("3-4.c1", "Question 4's Check button: code 2 of 3", "between the curly brackets of btnCheck4_Click, in frmQuiz.cs", Q, "btnCheck4_Click", 9, 19,
         [[9, 15, "Right answer: score up by 1, box goes green", "If rbB is chosen, 1 is added to Global.quizScore. The label shows the new score. The group box turns green."],
          [16, 19, "Wrong answer: box goes red", "Any other dot turns the group box red. The score stays as it was."]],
         ["rbB", "Global.quizScore", "lblResult", "gbQuestion4"], ["lblResult", "gbQuestion4"],
         yours="In my example the right answer is the second radio button, rbB. Look at YOUR question 4. Which of YOUR radio buttons is the right answer? Use that one's name."),
    {"watch": "Type this after the } that closes the first if, not inside it."}
   ]},
   {"id": "7", "title": "Switch question 4 off and question 5 on", "foot": "done",
    "done": "lines 20 to 22 are typed above the last curly bracket",
    "goal": "After marking, question 4's panel is switched off and question 5's panel is switched on, whatever the answer was.",
    "blocks": [
    {"p": "Question 4 is marked, so now switch its panel off and wake question 5 up."},
    code("3-5.c1", "Question 4's Check button: code 3 of 3", "between the curly brackets of btnCheck4_Click, in frmQuiz.cs", Q, "btnCheck4_Click", 20, 23,
         [[20, 22, "Switch off question 4, switch on question 5", "Question 4's panel gets Enabled = false and goes grey. Question 5's panel gets Enabled = true and wakes up."],
          given(23, 23)],
         ["pnlRadioQuestion", "pnlNumberQuestion"], ["pnlNumberQuestion"]),
    {"watch": "Type these lines after the } that closes the else, but before the last }. They run whether the answer was right or wrong."}
   ]},
   {"id": "8", "title": "Watch what question 4's Check button now does", "foot": "next",
    "done": "you have played the picture and seen question 5 light up",
    "goal": "When question 4 is checked, its panel goes grey and question 5's panel wakes up.",
    "blocks": [
    {"p": "Watch what happens to the panels when the right answer is checked."},
    {"flow": {"form": "frmQuiz", "lit": ["pnlQuizScore", "pnlRadioQuestion"], "then": ["pnlNumberQuestion"], "labels": QL,
              "watch": "question 4 going grey, then question 5 lighting up",
              "before": "Question 4 is on. The right dot is filled in.",
              "say": "Question 4 switches off. Question 5 switches on."}},
    {"watch": "Whatever the answer was, question 4 goes grey and question 5 wakes up."}
   ]},
   {"id": "9", "title": "Run your quiz and try question 4", "foot": "done",
    "done": "after Check, your question 4 is grey and question 5 is awake",
    "goal": "When I check question 4 in my own quiz, its panel goes grey and question 5's panel wakes up.",
    "blocks": [
    {"p": "Time to see it work in your own quiz."},
    {"steps": [step("3-6.1", "Click the green Start arrow at the top. Log in, go to the quiz and play through to question 4.",
                    "After Check, question 4 goes grey and question 5 is awake.", None,
                    [["Red errors appeared instead.", "The Error List at the bottom names the line. Double-click the error to jump to it."]])]},
    {"watch": "Question 5 still grey? Look again at the last three lines you typed."}
   ]}]},
  {"id": "4", "title": "Mark question 5, the one with the number box", "thing": "question 5's Check button", "verb": "making", "screens": [
   opener("Make question 5's Check button work",
          "This part writes the code behind question 5's Check button: mark the number, switch question 5 off, show the Return button.",
          "Question 5 is the last question. It has a number box with arrows and its own Check button.",
          "When it works, Check adds 1 to the score for the right number. The panel turns green or red, and the Return button appears."),
   {"id": "1", "title": "Double-click question 5's Check button", "foot": "done",
    "done": "the code tab is open at btnCheck5_Click, empty between the curly brackets",
    "goal": "Question 5's code lives behind its Check button, and its number is read with .Value.",
    "blocks": [
    {"p": "Open the code behind question 5's Check button the same way as question 4's."},
    {"steps": [step("4-1.1", "In the Design tab, double-click question 5's Check button.", "The code tab opens at btnCheck5_Click, empty between the curly brackets.")]},
    {"p": "Question 5 uses a number box. The pupil clicks the little arrows to pick a number. Your code reads that number with [[.Value|3]] and checks whether it is the right answer."}
   ]},
   {"id": "2", "title": "Add 1 to the score if the number is right", "foot": "done",
    "done": "lines 3 to 14 are typed with YOUR right number",
    "goal": "nudQuestion5.Value is the number showing, and if it equals the right answer the score goes up by 1.",
    "blocks": [
    {"p": "Type code 1 of 2 for question 5's Check button: the marking."},
    code("4-1.c1", "Question 5's Check button: code 1 of 2", "between the curly brackets of btnCheck5_Click, in frmQuiz.cs", Q, "btnCheck5_Click", 1, 14,
         [given(1, 2),
          [3, 9, "Right number: score up by 1, panel goes green", "If the box shows 8, 1 is added to the score. The label shows it. The panel turns green."],
          [10, 14, "Wrong number: panel goes red", "Any other number turns the panel red."]],
         ["nudQuestion5", "Global.quizScore", "lblResult", "pnlNumberQuestion"], ["nudQuestion5"],
         yours="In my example the right number is 8. YOUR question 5 has its own right answer. Use YOUR number."),
    {"watch": "Two equals signs ask a question: is it the same as 8? One equals sign would try to change it."}
   ]},
   {"id": "3", "title": "Switch off question 5 and show the Return button", "foot": "done",
    "done": "lines 15 to 17 are typed above the last curly bracket",
    "goal": "After question 5 is marked, its panel is switched off and the Return button is made visible.",
    "blocks": [
    {"p": "Question 5 is the last one, so after it is marked the Return button can appear."},
    code("4-2.c1", "Question 5's Check button: code 2 of 2", "between the curly brackets of btnCheck5_Click, in frmQuiz.cs", Q, "btnCheck5_Click", 15, 18,
         [[15, 17, "Switch off question 5, show the Return button", "Question 5's panel gets Enabled = false. The Return button gets Visible = true and appears."],
          given(18, 18)],
         ["pnlNumberQuestion", "btnReturn"], ["btnReturn"]),
    {"watch": "Visible = true brings the button back. The Load event hid it with Visible = false."}
   ]},
   {"id": "4", "title": "See the quiz played from start to end", "foot": "next",
    "done": "you have seen the Return button appear after question 5",
    "goal": "In a working quiz the questions open in order and the Return button appears after question 5.",
    "blocks": [
    {"p": "Before you play your own quiz, see mine played from the start to the Return button."},
    frames("F14", "The running quiz", [
      ("f14-1", "The running quiz just opened: question 1 on, four grey panels, no Return button", "The quiz opens: only question 1 on, no Return button."),
      ("f14-2", "The running quiz with question 1 marked and grey, question 2 on", "Question 1 is marked and grey. Question 2 is switched on."),
      ("f14-3", "The running quiz with all five marked, the score showing and the Return button visible", "All five are marked. The Return button has appeared.")],
      watch="the panels waking up one after another, then Return")
   ]},
   {"id": "5", "title": "Play your own quiz", "foot": "done",
    "done": "the Return button appears after you check question 5 in your quiz",
    "goal": "When I play my quiz, the questions open in order and the Return button appears after question 5.",
    "blocks": [
    {"p": "Play your quiz from the start and watch the panels wake up one after another."},
    {"steps": [step("4-3.1", "Click the green Start arrow. Play the quiz through to question 5.",
                    "After question 5's Check, the Return button appears in the score panel.")]},
    {"watch": "No Return button after question 5? Look at the Load event and at question 5's Check button."}
   ]}]},
  {"id": "5", "title": "Send the score back to the data entry form", "thing": "the Return button", "verb": "making", "screens": [
   opener("Make the Return button work",
          "This part writes the code behind the Return button: leave a note in Global.cs, close the quiz, open the data entry form.",
          "The Return button in the score panel takes the pupil back to the data entry form.",
          "When it works, Return leaves a note in Global.cs that the quiz is taken. Then it closes the quiz and opens the data entry form."),
   {"id": "1", "title": "Double-click the Return button", "foot": "done",
    "done": "the code tab is open at btnReturn_Click, empty between the curly brackets",
    "goal": "The Return button's code goes behind the button, and Global.cs is where a note survives the quiz closing.",
    "blocks": [
    {"p": "Open the code behind the Return button in the score panel."},
    {"steps": [step("5-1.1", "In the Design tab, double-click the Return button in the score panel.", "The code tab opens at btnReturn_Click, empty between the curly brackets.")]},
    {"p": "When a form closes, it forgets everything. Global.cs does not forget. Global.quizTaken is one thing in Global.cs. It is false until the quiz is taken. The Return button sets it to true."}
   ]},
   {"id": "2", "title": "Type the code that sends the score back", "foot": "done",
    "done": "lines 3 to 6 are typed in that order",
    "goal": "The Return button sets quizTaken to true in Global.cs, closes the quiz and opens a new data entry form.",
    "blocks": [
    {"p": "Four lines: a note, mark the quiz as taken, close it, open the data entry form."},
    code("5-1.c1", "The Return button", "between the curly brackets of btnReturn_Click, in frmQuiz.cs", Q, "btnReturn_Click", 1, 7,
         [given(1, 2),
          [3, 6, "Note, quiz taken, close, go back", "Global.quizTaken becomes true. this.Close() closes the quiz form. The last line makes a new data entry form and shows it."],
          given(7, 7)],
         ["Global.quizTaken", "frmDataEntry"], ["Global.quizTaken"]),
    {"watch": "The order matters. Leave the note first, then close, then open the data entry form."}
   ]},
   {"id": "3", "title": "Why the data entry form still says Quiz not taken", "foot": "next",
    "done": "you know chapter 8 is where the data entry form reads the note",
    "goal": "After Return, the data entry form comes back fresh and has not read Global.cs yet, and chapter 8 fixes that.",
    "blocks": [
    {"p": "Press Return and the data entry form comes back saying Quiz not taken yet."},
    {"p": "The name boxes are empty too. That is fine. Nothing is broken. The note is in Global.cs. The data entry form has not read it yet."},
    {"drawn": {"id": "fresh-screen", "alt": "The fresh data entry form on the left, Global.cs on the right with quizTaken set to true.",
               "say": "The fresh data entry form on the left. Global.cs on the right, with quizTaken set to true."}},
    {"p": "In chapter 8 the data entry form gets its own Load event. That Load event reads the note when the form opens."},
    {"watch": "Do not try to fix this now. Chapter 8 is where it gets fixed."}
   ]}]},
  {"id": "6", "title": "Test the whole quiz", "thing": "the whole quiz", "verb": "testing", "screens": [
   {"id": "1", "title": "Test the whole quiz", "foot": "chapter-done",
    "done": "all six rows are ticked",
    "goal": "I run the program and check each of the six things the quiz must do.",
    "blocks": [
    {"p": "Run your program and try each row, ticking the rows that work."},
    {"check": [
     tryit("6-1.t1", "Log in, type the details, work out the average, press Take Quiz.",
           "Only question 1 can be clicked. The other four are grey.", "Open the Load event's code again.", "#cw/07/2-5"),
     tryit("6-1.t2", "Answer questions 1 to 3. Then press question 4's Check with no dot filled in.",
           "A message appears. Question 4 stays switched on.", "Open the no-dot check again.", "#cw/07/3-5"),
     tryit("6-1.t3", "Choose the right radio button and press Check.",
           "The group box turns green and the score goes up by 1.", "Open the marking code again.", "#cw/07/3-6"),
     tryit("6-1.t4", "Set the right number on question 5 and press Check.",
           "The panel turns green and the Return button appears.", "Open question 5's code again.", "#cw/07/4-2"),
     tryit("6-1.t5", "Press Return.",
           "The quiz closes and the data entry form comes back.", "Open the Return button's code again.", "#cw/07/5-2"),
     tryit("6-1.t6", "Start the quiz again. Press question 5's Check before question 4 is answered.",
           "Nothing happens, because question 5's panel is grey.", "Open the Load event's code again.", "#cw/07/2-5", neg=True)]}
   ]}]}
 ]}

# ------------------------------------------------------------------ chapter 0
ch0 = {
 "id": "00", "n": 0, "of": 15, "title": "Start here: how to use this guide", "kind": "start", "color": "#4F2D9E", "noTurn": True,
 "one": "What you are making, how a chapter works, and the three rules.",
 "prev": None, "next": {"id": "01", "n": 1, "title": "The login form"},
 "methods": [],
 "stages": [
  {"id": "1", "title": "What you are making", "thing": "your whole program", "verb": "learning", "screens": [
   opener("See what your program is, before you make it", "My program is five forms joined by buttons, plus one text file that saves each pupil.",
          "Your program is five forms joined by buttons, plus one text file. This part shows the whole thing, then where it lives in Visual Studio.",
          "When you have read it, you know the five forms and how to run them."),
   {"id": "1", "title": "Meet the four words you will see a lot", "foot": "next", "done": "you have read the four words",
    "goal": "I know what a form, a control, a property and IntelliSense are.",
    "blocks": [
    {"p": "This guide helps you create your Unit 5 program, one part at a time."},
    {"words": [
      ["form", "One of the pages of your program. The login is a form. The quiz is a form.", "1-2", False],
      ["control", "Anything you put on a form: a button, a text box, a panel, a label.", "3-1", False],
      ["property", "A setting of a control, like its Name or its Text. The Properties window lists them.", "3-3", False],
      ["IntelliSense", "The list that pops up as you type code. It knows every name in your program.", "3-4", False]],
     "intro": "Click any marked word to see what it means."}
   ]},
   {"id": "2", "title": "See the five forms and the one file", "foot": "next", "done": "you have looked at the picture and read the line under it",
    "goal": "My program is five forms joined by buttons, plus one text file that saves each pupil.",
    "blocks": [
    {"p": "Here is the whole program, five forms and one file."},
    {"drawn": {"id": "five-screens", "alt": "Five cards: Login, Data entry, Quiz, Reaction test and Report, joined by arrows, with a note card for the file pupilStats.txt.",
               "say": "Each card is one [[form|0]], and the arrows are the buttons between them.",
               "cards": [["frmLogin", "Login", "Two boxes and a button."],
                         ["frmDataEntry", "Data entry", "Five panels, where everything is typed in."],
                         ["frmQuiz", "Quiz", "Five questions, one score."],
                         ["frmTest", "Reaction test", "Twelve pictures and a ten-second clock."],
                         ["frmReport", "Report", "A table of every saved pupil."],
                         ["pupilStats.txt", "The file", "Your program saves each pupil's results in here, one line per pupil."]]}},
    {"p": "You have made some of these already, and the home page shows which parts are done."},
    {"watch": "Every form has a name that starts with frm. You will see those names in the code."}
   ]},
   {"id": "3", "title": "See where your forms live", "foot": "next", "done": "you have found Solution Explorer on the right",
    "goal": "Solution Explorer lists my forms and Global.cs, on the right of Visual Studio.",
    "blocks": [
    {"p": "Everything in your project is listed in Solution Explorer, on the right of Visual Studio."},
    frames("F11", "Solution Explorer", [
      ("f11-1", "Solution Explorer on the right of Visual Studio 2019, listing the five forms and Global.cs", "Solution Explorer is on the right, with every form and Global.cs listed.")],
      watch="Watch for Global.cs listed under the five forms"),
    {"watch": "Global.cs is listed under the five forms. It is the file that remembers things between forms."}
   ]},
   {"id": "4", "title": "Open a form's Design tab and its code tab", "foot": "next", "done": "you have opened one form's code",
    "goal": "Double-clicking a form opens the Design tab, and View Code opens the code tab.",
    "blocks": [
    {"p": "Each form has a Design tab for the form and a code tab for its code."},
    frames("F11b", "Design tab and code tab", [
      ("f11-2", "The right-click menu of a form with View Code highlighted", "Double-click a form for its Design tab. Right-click it for View Code.")],
      watch="Watch for View Code in the right-click menu"),
    {"p": "Closing a tab deletes nothing. Double-click the form to open it again."}
   ]},
   {"id": "5", "title": "Start your program with the green arrow", "foot": "next", "done": "you have seen the green Start arrow",
    "goal": "The green Start arrow runs my program.",
    "blocks": [
    {"p": "You will run your program a lot, so here is how to start it."},
    frames("F9", "Running your program", [
      ("f9-1", "The toolbar with the green Start arrow", "The green Start arrow at the top runs your program.")],
      watch="Watch for the green Start arrow at the top"),
    {"watch": "Use the green arrow and the menus, never keyboard shortcuts. In a browser tab, a shortcut can reload the page."}
   ]},
   {"id": "6", "title": "Stop your program with the red square", "foot": "next", "done": "you have seen the red Stop square",
    "goal": "The red square stops my program.",
    "blocks": [
    {"p": "While your program runs, the green arrow becomes a red Stop square."},
    frames("F9b", "Stopping your program", [
      ("f9-2", "The toolbar while the program runs, with the red Stop square", "Press the red Stop square to stop your program.")],
      watch="Watch the green arrow turn into a red square"),
    {"watch": "Stop your program before you go back to typing code."}
   ]}]},
  {"id": "2", "title": "How this guide works", "thing": "how this guide works", "verb": "learning", "screens": [
   opener("See how a chapter works and where you are up to", "Every chapter has the same shape, and the home page shows me my next job.",
          "Every chapter has the same shape. The home page shows which parts are done and which part is next.",
          "When you have read it, you can find your next job on any day."),
   {"id": "1", "title": "See what a chapter looks like", "foot": "next", "done": "you have looked at the picture and read the lines under it",
    "goal": "A chapter is a row of parts, each part is a few screens, and each screen has one job.",
    "blocks": [
    {"p": "This guide is split into chapters."},
    {"p": "One chapter is one part of your program, like the login or the quiz."},
    {"drawn": {"id": "mini-chapter", "alt": "A small drawn chapter: a row of part pills, a list of three steps with tick boxes, and a big button at the foot.",
               "say": "A chapter is a row of parts, each a few screens."}},
    {"p": "Every chapter starts by checking what you need, and ends with a Try it screen."}
   ]},
   {"id": "2", "title": "Mark a screen done with the big button", "foot": "next", "done": "you know what the big button at the bottom does",
    "goal": "The big button at the bottom ticks a screen off and moves me on.",
    "blocks": [
    {"p": "Each screen says what you are making, and when it is done."},
    {"p": "When you have done a screen, press the big button at the bottom."},
    {"p": "It ticks the screen and moves you on to the next one."},
    {"watch": "Your ticks are saved to your school account. Next lesson, the guide opens where you left off."}
   ]},
   {"id": "3", "title": "Open the first part that is not ticked", "foot": "next", "done": "you know how to find your next job on the home page",
    "goal": "The home page lists every part in order, I tick what I have done, and I open the first part that is not ticked.",
    "blocks": [
    {"p": "The home page is called Where am I up to? and it lists every part in order."},
    {"p": "Tick the parts you have already done, then open the first part that is not ticked."},
    {"p": "If you were away, this is how you pick up where you were."},
    {"drawn": {"id": "home-card", "alt": "One chapter card from the home page: the number, the title, a progress ring that fills as you tick, an Open button and a smaller I did this already button.",
               "say": "The grey button is for a part you made before this guide."}},
    {"watch": "Only press I did this already if it is true, because the guide cannot check. Your program will."}
   ]}]},
  {"id": "3", "title": "The three rules", "thing": "the three rules", "verb": "learning", "screens": [
   opener("Meet the three rules you keep all the way through", "Three rules run through every chapter of this guide.",
          "Three rules run through every chapter. My names are not your names. IntelliSense types names for you. You type every line yourself.",
          "When you keep them, red lines are rare and your names stay your own."),
   {"id": "1", "title": "Meet rule 1: my names are not your names", "foot": "next", "done": "you know that MY names may differ from YOUR names",
    "goal": "The guide shows the names Mr Gartland gave his controls, and I use the names I gave mine.",
    "blocks": [
    {"p": "Every [[control|1]] in your program has a name, like tbxSurname, and the code uses those names."},
    {"p": "This guide shows MY example with MY names, and YOUR names may be different."},
    {"names": {"form": "frmDataEntry", "list": ["tbxSurname", "btnEnter", "pnlPupilDetails"]}},
    {"watch": "When you see one of my names, read it as the name YOU gave that control."}
   ]},
   {"id": "2", "title": "Click a control to find its name", "foot": "next", "done": "you know that one click in the Design tab picks a control",
    "goal": "To find a control's name, I click it once in the Design tab.",
    "blocks": [
    {"p": "The name is a [[property|2]] of the control, one of its settings."},
    frames("F2", "Finding a control's name", [
      ("f2-1", "The Design tab with one text box clicked once", "In the Design tab, click the control once.")],
      watch="Watch the control get small handles when it is clicked")
   ]},
   {"id": "3", "title": "Read the name at the top of the Properties window", "foot": "next", "done": "you know where to find the name of any control",
    "goal": "The name sits beside Name at the top of the Properties window.",
    "blocks": [
    {"p": "The Properties window lists the settings of the control you clicked."},
    frames("F2b", "The Name line", [
      ("f2-2", "The Properties window with the name tbxSurname at the top", "At the top of the Properties window, the name sits beside Name.")],
      watch="Watch the Name line at the top of the Properties window"),
    {"watch": "If the Properties window is not there, open the View menu and click Properties Window."}
   ]},
   {"id": "4", "title": "Meet rule 2: let IntelliSense type the name", "foot": "next", "done": "you have watched the list pop up and finish a name",
    "goal": "When I type the first letters of a name, IntelliSense lists the names in my program and Tab finishes it.",
    "blocks": [
    {"p": "[[IntelliSense|3]] is the list that pops up as you type code."},
    {"isense": {"form": "frmDataEntry", "typed": "pnl", "pick": "pnlPupilDetails",
                "list": ["pnlPupilDetails", "pnlQuizResult", "pnlReactionTest", "pnlSwimLengths", "pnlSwimmingGroup"]}},
    {"p": "It knows every name in your program and types most of each one for you."}
   ]},
   {"id": "5", "title": "See the first letters typed on a new line", "foot": "next", "done": "you have seen the first letters typed on a new line",
    "goal": "I type the first letters of a name on a new line.",
    "blocks": [
    {"p": "Here is the real list in Visual Studio 2019, in three pictures."},
    frames("F3", "The real list: picture 1 of 3", [
      ("f3-1", "The code tab with pnl typed on a new line", "Type the first letters of the name.")],
      watch="Watch the letters pnl typed on a new line")
   ]},
   {"id": "6", "title": "See the list pop up with every matching name", "foot": "next", "done": "you have seen the list pop up under the letters",
    "goal": "The list pops up with every matching name in my program.",
    "blocks": [
    {"p": "As soon as you type, the list pops up under the letters."},
    frames("F3b", "The real list: picture 2 of 3", [
      ("f3-2", "The IntelliSense list open under pnl, showing the matching names", "The list pops up with every matching name in YOUR program.")],
      watch="Watch the list pop up as pnl is typed"),
    {"watch": "If a name is not in the list, your control has a different name. Check it in the Properties window."}
   ]},
   {"id": "7", "title": "See Tab type the whole name", "foot": "next", "done": "you know that Tab types the name from the list",
    "goal": "Tab types the name for me, spelt right.",
    "blocks": [
    {"p": "Press Tab and the name is typed for you, spelt right."},
    frames("F3c", "The real list: picture 3 of 3", [
      ("f3-3", "The line completed to a panel name", "Press Tab. The name is typed for you, spelt right.")],
      watch="Watch the name get typed when Tab is pressed")
   ]},
   {"id": "8", "title": "Meet rule 3: you type every line yourself", "foot": "next", "done": "you have read the three practice lines",
    "goal": "I cannot copy code from the guide, I type it, and I read each line as I type it.",
    "blocks": [
    {"p": "You cannot copy code from this guide, so you type every line yourself."},
    {"p": "Typing is how it sticks in your head."},
    {"p": "You do not type these anywhere yet. Read them and see how they look."},
    {"code": {"id": "3-3.c1", "kind": "read", "snippet": True, "title": "Three lines to try, for practice only",
              "where": "nowhere yet. This one is only for trying the rule.", "lang": "cs",
              "text": "pnlPupilDetails.Enabled = false;\npnlSwimLengths.Enabled = true;\nbtnEnter.Visible = false;",
              "partLines": [[1, 3, "Three lines you will meet again", "Switch off one panel, switch on the next, hide a button. Each line ends with a semicolon."]],
              "names": ["pnlPupilDetails", "pnlSwimLengths", "btnEnter"], "isense": ["pnlPupilDetails"]}},
    {"watch": "Read each line as you type it, so you know what it does."}
   ]},
   {"id": "9", "title": "Try to copy a line from the guide", "foot": "done", "done": "you have tried to copy a line and the guide said no",
    "goal": "I have tried to copy a line and seen the guide refuse.",
    "blocks": [
    {"p": "Go back one screen and try to copy a line from the code box there."},
    {"steps": [step("3-3.1", "Select a line in the box, then right-click it or drag it.",
                    "The guide says no, with a small message. You type it instead.")]}
   ]},
   {"id": "10", "title": "See what a red line means", "foot": "next", "done": "you know what a red wiggly line means and where the Error List is",
    "goal": "A red wiggly line means Visual Studio does not understand that line, and the Error List takes me to it.",
    "blocks": [
    {"p": "Sometimes a line gets a red wiggly underline."},
    {"p": "That means Visual Studio does not understand it yet."},
    frames("F10", "Finding an error", [
      ("f10-1", "A code line with a red wiggly underline under a misspelt name", "A red wiggly line under a word."),
      ("f10-2", "The Error List at the bottom of Visual Studio 2019 with one error", "The Error List at the bottom names the problem."),
      ("f10-3", "The cursor on the line after double-clicking the error", "Double-click the error. The cursor jumps to the line.")],
      watch="Watch the Error List name the line with the red wiggle"),
    {"watch": "Most red lines are a name spelt differently from the control. Check the name in the Properties window."}
   ]},
   {"id": "11", "title": "Check your program builds before you run it", "foot": "chapter-done", "done": "you have seen Build succeeded at the bottom left",
    "goal": "Build Solution checks every line, and Build succeeded at the bottom left means I can run it.",
    "blocks": [
    {"p": "Build before you run, because building checks every line of your code."},
    frames("F12", "Building", [
      ("f12-1", "The Build menu open with Build Solution highlighted", "Open the Build menu and choose Build Solution."),
      ("f12-2", "The bottom left of Visual Studio 2019 saying Build succeeded", "Bottom left says Build succeeded.")],
      watch="Watch for Build succeeded at the bottom left"),
    {"watch": "If the bottom left says Build failed, go back one screen and find the red line."}
   ]}]}
 ]}
for ch in (ch0, ch7):
    ch["glossary"] = [[w[0], w[1]] for s in ch["stages"] for sc in s["screens"] for b in sc["blocks"] if "words" in b for w in b["words"]]

# ------------------------------------------------------------------ tick ids
def tick_ids(ch):
    ids = []
    def walk(n):
        if isinstance(n, list):
            for x in n: walk(x)
        elif isinstance(n, dict):
            if "steps" in n and isinstance(n["steps"], list) and n["steps"] and isinstance(n["steps"][0], dict) and "do" in n["steps"][0]:
                ids.extend(s["id"] for s in n["steps"])
            if "check" in n: ids.extend(r["id"] for r in n["check"])
            if "code" in n and n["code"].get("kind") == "type": ids.append(n["code"]["id"])
            for k, v in n.items():
                if k not in ("steps", "check", "code"): walk(v)
    walk(ch["stages"]); return ids

# ------------------------------------------------------------------ the other chapters
import glob
BUILT = {0: ch0, 7: ch7}
for f in sorted(glob.glob(os.path.join(HERE, 'chapters', 'ch[0-9][0-9].py'))):
    ns = dict(globals()); exec(compile(open(f).read(), f, 'exec'), ns); BUILT[int(ns['CH']['id'])] = ns['CH']

# ------------------------------------------------------------------ index from the spec briefs
SPEC = os.path.join(D, 'DESIGN_SPEC.md')
if not os.path.exists(SPEC): SPEC = '/Users/damiengartland/Desktop/Claude Work/S2 U5CA Guide/_design/DESIGN_SPEC.md'
_all = open(SPEC).read().split('\n')
_a = next(i for i, l in enumerate(_all) if l.startswith('## 9. Chapter briefs'))
_b = next(i for i, l in enumerate(_all) if l.startswith('## 10. '))
spec = _all[_a:_b]
briefs = {}; cur = None
for ln in spec:
    m = re.match(r'#### Chapter (\d+) — (.+?)\s{2,}\((.+)\)', ln)
    if m:
        cur = int(m.group(1)); briefs[cur] = {"title": m.group(2), "meta": m.group(3), "lines": [], "one": ""}; continue
    if cur is None: continue
    m = re.match(r'One: "(.+)"', ln)
    if m: briefs[cur]["one"] = m.group(1); continue
    briefs[cur]["lines"].append(ln)
colors = {0: "#4F2D9E", 1: "#E84D6A", 2: "#F28C28", 3: "#2A9D8F", 4: "#1F77B4", 5: "#8E44AD", 6: "#D1495B", 7: "#0F9D8A", 8: "#E07A1F",
          9: "#C2185B", 10: "#3A6EA5", 11: "#6A994E", 12: "#B5651D", 13: "#5C6BC0", 14: "#C9A227"}
chapters = []
for n in range(15):
    b = briefs[n]; text = '\n'.join(b["lines"])
    stages = []
    if n in BUILT:
        stages = [[s["id"], s["title"], len([x for x in s["screens"] if not x.get("opener")]), s.get("thing", "")] for s in BUILT[n]["stages"]]
    else:
        names = {}
        for m in re.finditer(r'^- (\d{1,2}) (.+?)(?: — |$)', text, re.M): names[m.group(1)] = m.group(2).strip()
        counts = {}
        for m in re.finditer(r'\b(\d{1,2})-(\d{1,2})\b', text):
            s, k = m.group(1), int(m.group(2))
            if s in names: counts[s] = max(counts.get(s, 0), k)
        has_hygt = 'Have you got this?' in text and n != 14
        if has_hygt or n == 14: stages.append(["1", "Check you have what this chapter needs" if has_hygt else "Before you start", 1])
        for s in sorted(names, key=int): stages.append([s, names[s], counts.get(s, 1)])
    built = BUILT.get(n)
    entry = {"id": "%02d" % n, "n": n, "title": built["title"] if built else b["title"], "one": built["one"] if built else b["one"], "color": colors[n],
             "built": n in BUILT, "steps": tick_ids(built) if built else [],
             "stages": stages, "screens": sum(s[2] for s in stages)}
    if n == 14: entry["hidden"] = "after-all"
    chapters.append(entry)
index = {
 "intro": "This guide helps you create your Unit 5 program, one part at a time. Each part shows MY example and says where YOUR program will be different.",
 "header": "Tick the parts you have done. Then open the first part that is not ticked.",
 "expected": [1, 2, 3, 4, 5, 6],
 "chapters": chapters}

out = os.path.join(D, 'content')
for name, obj in [("ch%02d.json" % n, c) for n, c in sorted(BUILT.items())] + [("index.json", index)]:
    with open(os.path.join(out, name), 'w') as f: json.dump(obj, f, ensure_ascii=False, indent=1)
    print(name, 'written')
for c in chapters: print(' ', c["id"], c["title"][:34].ljust(34), 'stages', len(c["stages"]), 'screens', c["screens"], 'ticks', len(c["steps"]), c.get("hidden", ""))
