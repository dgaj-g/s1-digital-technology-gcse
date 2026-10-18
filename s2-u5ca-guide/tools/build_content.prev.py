#!/usr/bin/env python3
"""Builds content/ch00.json, content/ch07.json and content/index.json from the briefs in DESIGN_SPEC.md §9.
Run: python3 -I tools/build_content.py   (from _design/)"""
import json, re, os
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
GIVEN1 = ["Visual Studio wrote this line", "The closing bracket ends the method.", "given"]
def given(a, b): return [a, b] + (GIVEN2 if b > a else GIVEN1)

def step(id_, do, see, img=None, wrong=None):
    s = {"id": id_, "do": do, "see": see}
    if img: s["img"] = img
    if wrong: s["wrong"] = wrong
    return s
def cap(name, alt, w=1280, h=800, marks=None):
    d = {"img": "img/cap/" + name + ".png", "alt": alt, "w": w, "h": h}
    if marks: d["marks"] = marks
    return d
def frames(fid, title, fr):
    return {"frames": {"id": fid, "title": title, "frames": [dict(cap(n, alt), say=say) for n, alt, say in fr]}}
def have(id_, what, how, fix, go):
    return {"id": id_, "what": what, "how": how, "fix": fix, "go": go, "expect": "have"}
def tryit(id_, what, how, fix, go, neg=False):
    return {"id": id_, "what": what, "how": how, "fix": fix, "go": go, "expect": "mustnot" if neg else "must"}

# ------------------------------------------------------------------ chapter 7
Q = 'frmQuiz'
ch7 = {
 "id": "07", "n": 7, "of": 15, "title": "Finish the quiz", "kind": "new", "color": "#0F9D8A", "noTurn": True,
 "one": "Lock the questions in order, mark the last two, and go back with the score.",
 "prev": {"id": "06", "n": 6, "title": "The quiz: the first three questions"},
 "next": {"id": "08", "n": 8, "title": "The data entry screen's Load event"},
 "methods": [["frmQuiz", "frmQuiz_Load"], ["frmQuiz", "btnCheck4_Click"], ["frmQuiz", "btnCheck5_Click"], ["frmQuiz", "btnReturn_Click"]],
 "stages": [
  {"id": "1", "title": "Have you got this?", "screens": [
   {"id": "1", "title": "Have you got this?", "foot": "have", "blocks": [
    {"p": "On this screen you check what you need before chapter 7."},
    {"check": [
     have("1-1.t1", "Open frmQuiz in the Design tab. Does question 4's panel hold a group box with four radio buttons and a Check button?",
          "In OUR example it is the panel on the right of the middle row. In YOURS, look for the panel with the radio buttons.", "Go to chapter 6, stage 2.", "#cw/06/2-1"),
     have("1-1.t2", "Does question 5's panel hold a number box and a Check button?",
          "In OUR example it is the wide panel along the bottom. In YOURS, look for the panel with the number box.", "Go to chapter 6, stage 2.", "#cw/06/2-1"),
     have("1-1.t3", "Is there a Return button in the score panel?",
          "In OUR example it is in the tall panel on the left, near the bottom. In YOURS, look in the score panel.", "Go to chapter 6, stage 2.", "#cw/06/2-1"),
     have("1-1.t4", "Double-click question 3's Check button. Is there code inside btnCheck3_Click?",
          "The code tab opens at btnCheck3_Click. Lines between its two curly brackets mean yes.", "Go to chapter 6, stage 5.", "#cw/06/5-1"),
     have("1-1.t5", "Open Global.cs. Are quizScore and quizTaken in it?",
          "Solution Explorer on the right. Double-click Global.cs.", "Go to chapter 3, stage 3.", "#cw/03/3-1")]},
    {"box": {"title": "Not sure what you have?", "fold": True,
             "text": "Solution Explorer is on the right of Visual Studio 2019. It lists every form. Double-click frmQuiz to see its Design tab. Right-click it and choose View Code to see its code."}}
   ]}]},
  {"id": "2", "title": "The quiz's Load event", "screens": [
   {"id": "1", "title": "What happens the moment a screen opens", "foot": "next", "blocks": [
    {"p": "On this screen you meet the Load event."},
    {"words": [
      ["Load event", "The code that runs the moment the window first appears, before you can click anything.", "2-1", True],
      [".Checked", "Whether a radio button's dot is filled. True when it is chosen, false when it is not.", "3-1", True],
      ["return;", "Stop here. Nothing below this line runs.", "3-3", True],
      [".Value", "The number the box shows.", "4-1", True]],
     "intro": "Four new words in this chapter. Click any marked word to see what it means."},
    {"p": "A [[Load event|0]] is code that runs the moment the window first appears. It runs before anyone clicks anything."},
    {"drawn": {"id": "load-now", "alt": "The quiz window slides in. A code card lights up under it with the words runs now.",
               "say": "The quiz window opens. Its Load event runs straight away, with no click."}},
    {"p": "Every screen can have one. This is the first one you write."},
    {"p": "The quiz needs one because only question 1 should be open at the start."},
    {"watch": "A Load event is not a button. Nobody presses it. The window opening is what runs it."}
   ]},
   {"id": "2", "title": "Find the Load event", "foot": "done", "blocks": [
    {"p": "On this screen you open the quiz's Load event, ready to type into."},
    {"steps": [
     step("2-2.1", "Open frmQuiz in the Design tab. Click the form's title bar once.",
          "The Properties window shows frmQuiz at the top.", cap("f4-1", "The quiz form in the Design tab with its title bar clicked, and the Properties window showing frmQuiz")),
     step("2-2.2", "In the Properties window, press the lightning bolt button.",
          "The list changes from properties to events.", cap("f4-2", "The Properties window with the lightning bolt button pressed, showing the events list"),
          [["I cannot see a lightning bolt.", "The Properties window may be closed. Open the View menu and choose Properties Window."]]),
     step("2-2.3", "Scroll down to the row called Load. Double-click the empty box beside it.",
          "The code tab opens with frmQuiz_Load written for you.", cap("f4-3", "The events list with the Load row and its empty box")),
     step("2-2.4", "Look at the new method. Your cursor is blinking between its two curly brackets.",
          "The method is empty. Your code goes between the brackets.", cap("f4-4", "The code tab with the new empty frmQuiz_Load method"),
          [["I got frmQuiz_Click instead.", "You double-clicked the form. Go back to Properties, press the lightning bolt, find Load."],
           ["Nothing happened when I double-clicked.", "Double-click the empty box to the right of the word Load, not the word itself."]])]},
    {"watch": "Lightning bolt first. Without it, double-clicking makes a Click event, not a Load event."}
   ]},
   {"id": "3", "title": "Only the first question is open", "foot": "next", "blocks": [
    {"p": "On this screen you see what the quiz should look like the moment it opens."},
    {"flow": {"form": "frmQuiz", "lit": ["pnlQuizScore", "pnlTextQuestion"], "then": [],
              "say": "The score panel is open. Of the five questions, only question 1 is open at the start."}},
    {"p": "Each question lives in its own panel. Locking four of them is the Load event's job."},
    {"p": "When a question is answered, its panel locks and the next one unlocks. You write that in stages 3 and 4."},
    {"watch": "Count the panels you must lock: four question panels. The Return button is hidden too."}
   ]},
   {"id": "4", "title": "Type the Load event", "foot": "done", "blocks": [
    {"p": "On this screen you type the Load event: four locks and one hidden button."},
    code("2-4.c1", "The quiz's Load event", "inside frmQuiz_Load, in frmQuiz.cs", Q, "frmQuiz_Load", 1, 9,
         [given(1, 2),
          [3, 7, "Lock four questions", "The comment says what the lines are for. Each line locks one panel. Enabled = false means locked and grey."],
          [8, 8, "Hide Return until the end", "Visible = false hides the button. Stage 4 shows it again after question 5."],
          given(9, 9)],
         ["pnlButtonsQuestion", "pnlListQuestion", "pnlRadioQuestion", "pnlNumberQuestion", "btnReturn"],
         ["pnlButtonsQuestion", "pnlListQuestion", "pnlRadioQuestion", "pnlNumberQuestion", "btnReturn"]),
    {"box": {"title": "See the real IntelliSense list", "fold": True, "blocks": [
      frames("F3", "IntelliSense in Visual Studio 2019", [
        ("f3-1", "The code tab with pnl typed on a new line", "Type the first letters of the name."),
        ("f3-2", "The IntelliSense list open under pnl, showing the six panel names", "The list appears with every matching name in YOUR program."),
        ("f3-3", "The line completed to pnlButtonsQuestion", "Press Tab. The name is finished for you, spelt right.")])]}},
    {"watch": "Four panels get Enabled = false. The Return button gets Visible = false, not Enabled."}
   ]}]},
  {"id": "3", "title": "Question 4: the radio buttons", "screens": [
   {"id": "1", "title": "What a radio button knows", "foot": "next", "blocks": [
    {"p": "On this screen you learn what a radio button can tell your code."},
    {"p": "A radio button has a dot. [[.Checked|1]] is true when the dot is filled and false when it is empty."},
    {"code": {"id": "3-1.r1", "kind": "read", "snippet": True, "title": "Two ways to ask a radio button", "lang": "cs",
              "text": "rbB.Checked\n!rbA.Checked",
              "partLines": [[1, 1, "Is B chosen?", "True when the dot of rbB is filled."],
                            [2, 2, "Is A NOT chosen?", "The exclamation mark means not. True when the dot of rbA is empty."]],
              "names": ["rbA", "rbB"], "isense": []}},
    {"watch": "An exclamation mark in front means NOT. !rbA.Checked reads as A is not chosen."}
   ]},
   {"id": "2", "title": "Open the Check button's code", "foot": "done", "blocks": [
    {"p": "On this screen you open the code of question 4's Check button."},
    frames("F1", "Opening a button's code", [
      ("f1-1", "The quiz form in the Design tab, with the pointer on question 4's Check button", "In the Design tab, double-click the button once."),
      ("f1-2", "The code tab with a new empty btnCheck4_Click method", "The code tab opens with a new empty method named after the button.")]),
    {"steps": [step("3-2.1", "In the Design tab of frmQuiz, double-click question 4's Check button.",
                    "The code tab opens at btnCheck4_Click, empty.")]},
    {"watch": "Double-click the button itself, not the panel around it. Double-clicking the panel makes a method you do not want."}
   ]},
   {"id": "3", "title": "Nothing chosen? Stop here", "foot": "done", "blocks": [
    {"p": "On this screen you make the Check button refuse to mark an empty answer."},
    {"p": "If no dot is filled, no answer was chosen. The code shows a message and stops."},
    code("3-3.c1", "The Check button for question 4, part 1 of 3", "inside btnCheck4_Click, in frmQuiz.cs", Q, "btnCheck4_Click", 1, 8,
         [given(1, 2),
          [3, 8, "Nothing chosen? Stop here", "If all four dots are empty, a message appears and the method stops. Nothing under return runs."]],
         ["rbA", "rbB", "rbC", "rbD"], ["rbA"]),
    {"p": "[[return;|2]] means stop here. When nothing is chosen, nothing under this line runs."},
    {"drawn": {"id": "stop-sign", "alt": "A stop sign drops onto the return line of the code.",
               "say": "The stop sign lands on return. Nothing under this line runs."}},
    {"watch": "Each && means AND. All four dots must be empty for the message to show."}
   ]},
   {"id": "4", "title": "Mark it", "foot": "done", "blocks": [
    {"p": "On this screen you mark question 4: right turns green, wrong turns red."},
    code("3-4.c1", "The Check button for question 4, part 2 of 3", "inside btnCheck4_Click, in frmQuiz.cs", Q, "btnCheck4_Click", 9, 19,
         [[9, 15, "Right answer", "If rbB is chosen, the score goes up by 1. The label shows the new score and the group box turns green."],
          [16, 19, "Wrong answer", "Any other dot turns the group box red. The score stays as it was."]],
         ["rbB", "Global.quizScore", "lblResult", "gbQuestion4"], ["lblResult", "gbQuestion4"],
         yours="In OUR example the right answer is the second radio button, rbB. Read YOUR question 4. Which of YOUR radio buttons is right? Use THAT name."),
    {"watch": "Type this code after the } that closes the if, not inside the if."}
   ]},
   {"id": "5", "title": "Lock this question, unlock the last one", "foot": "next", "blocks": [
    {"p": "On this screen you lock question 4 and unlock question 5."},
    code("3-5.c1", "The Check button for question 4, part 3 of 3", "inside btnCheck4_Click, in frmQuiz.cs", Q, "btnCheck4_Click", 20, 23,
         [[20, 22, "Lock this question, unlock the last one", "Question 4 is finished, so its panel locks. Question 5's panel unlocks."],
          given(23, 23)],
         ["pnlRadioQuestion", "pnlNumberQuestion"], ["pnlNumberQuestion"]),
    {"watch": "Type these two lines after the } that closes the else, but before the last }. They run whether the answer was right or wrong."}
   ]},
   {"id": "6", "title": "Watch the lock move", "foot": "done", "blocks": [
    {"p": "On this screen you watch question 4 lock and question 5 unlock, then run your program."},
    {"flow": {"form": "frmQuiz", "lit": ["pnlQuizScore", "pnlRadioQuestion"], "then": ["pnlNumberQuestion"],
              "say": "Question 4 locks. Question 5 unlocks."}},
    {"steps": [step("3-6.1", "Click the green Start arrow at the top. The program should run with no red errors.",
                    "If the Error List opens instead, double-click the error to find the line.")]}
   ]}]},
  {"id": "4", "title": "Question 5: the number box", "screens": [
   {"id": "1", "title": "Is the number right?", "foot": "done", "blocks": [
    {"p": "On this screen you mark question 5, the number box."},
    {"p": "A number box has [[.Value|3]], the number it shows. The code compares it with the right answer."},
    {"steps": [step("4-1.1", "In the Design tab, double-click question 5's Check button.", "The code tab opens at btnCheck5_Click, empty.")]},
    code("4-1.c1", "The Check button for question 5, part 1 of 2", "inside btnCheck5_Click, in frmQuiz.cs", Q, "btnCheck5_Click", 1, 14,
         [given(1, 2),
          [3, 9, "Right number", "If the box shows 8, the score goes up by 1. The label shows it and the panel turns green."],
          [10, 14, "Wrong number", "Any other number turns the panel red."]],
         ["nudQuestion5", "Global.quizScore", "lblResult", "pnlNumberQuestion"], ["nudQuestion5"],
         yours="OUR right number is 8. YOUR question 5 has its own right number. Use THAT number."),
    {"watch": "Two equals signs ask a question: is it the same as 8? One equals sign would try to change it."}
   ]},
   {"id": "2", "title": "Lock the last question, show Return", "foot": "done", "blocks": [
    {"p": "On this screen you finish question 5 and show the Return button."},
    code("4-2.c1", "The Check button for question 5, part 2 of 2", "inside btnCheck5_Click, in frmQuiz.cs", Q, "btnCheck5_Click", 15, 18,
         [[15, 17, "Lock the last question, show Return", "Question 5 locks. The Return button, hidden by the Load event, appears."],
          given(18, 18)],
         ["pnlNumberQuestion", "btnReturn"], ["btnReturn"]),
    {"watch": "Visible = true brings the button back. The Load event hid it with Visible = false."}
   ]},
   {"id": "3", "title": "Play the quiz", "foot": "done", "blocks": [
    {"p": "On this screen you run the quiz and watch the Return button appear."},
    frames("F14", "The running quiz", [
      ("f14-1", "The running quiz just opened: question 1 open, four grey panels, no Return button", "The quiz opens. Only question 1 is open. There is no Return button."),
      ("f14-2", "The running quiz with question 1 answered and locked, question 2 open", "Question 1 is answered and locked. Question 2 is open. The rest are grey."),
      ("f14-3", "The running quiz with all five answered, the score showing and the Return button visible", "All five answered. The score panel shows the Return button.")]),
    {"steps": [step("4-3.1", "Click the green Start arrow. Play the quiz through to question 5.",
                    "After question 5's Check, the Return button appears in the score panel.")]},
    {"watch": "No Return button after question 5? Check the Load event and question 5's Check button."}
   ]}]},
  {"id": "5", "title": "Back with the score", "screens": [
   {"id": "1", "title": "Write it in the notebook", "foot": "done", "blocks": [
    {"p": "On this screen you code the Return button, which takes the score back."},
    {"p": "The data entry screen will need to know the quiz happened. A window forgets everything when it closes. Global, the notebook, does not."},
    {"p": "Global is the notebook. Global.quizTaken is one note in it, true or false."},
    {"steps": [step("5-1.1", "In the Design tab, double-click the Return button in the score panel.", "The code tab opens at btnReturn_Click, empty.")]},
    code("5-1.c1", "The Return button", "inside btnReturn_Click, in frmQuiz.cs", Q, "btnReturn_Click", 1, 7,
         [given(1, 2),
          [3, 6, "Write it down, close, go back", "The notebook now says the quiz was taken. This window closes and a new data entry window opens."],
          given(7, 7)],
         ["Global.quizTaken", "frmDataEntry"], ["Global.quizTaken"]),
    {"p": "this.Close() closes the quiz window. The next line makes a new data entry window and shows it."},
    {"watch": "The order matters. Write in the notebook first, then close, then open the next window."}
   ]},
   {"id": "2", "title": "What you will see, and what you will not see yet", "foot": "next", "blocks": [
    {"p": "On this screen you see what comes back after Return, and what does not."},
    {"p": "After Return, the data entry screen comes back fresh. The quiz panel still says Quiz not taken yet, and the name boxes are empty."},
    {"p": "That is expected. Chapter 8 teaches the screen to read the notebook when it opens."},
    {"drawn": {"id": "fresh-screen", "alt": "The fresh data entry screen on the left, the full notebook on the right with quizTaken set to true.",
               "say": "The fresh screen on the left. The full notebook on the right, with quizTaken true."}},
    {"watch": "Nothing is broken. The notebook is full. The screen has not read it yet."}
   ]}]},
  {"id": "6", "title": "Try it", "screens": [
   {"id": "1", "title": "Try it", "foot": "chapter-done", "blocks": [
    {"p": "On this screen you run the program and test the whole quiz."},
    {"p": "Click the green Start arrow and try each row. Tick the rows that work."},
    {"check": [
     tryit("6-1.t1", "Log in, enter the details, work out the average, press Take Quiz.",
           "Only question 1 can be used. The other four are grey.", "Check the Load event on screen 2-4.", "#cw/07/2-4"),
     tryit("6-1.t2", "Answer questions 1 to 3. Then press question 4's Check with no dot filled.",
           "A message appears. Question 4 stays open.", "Check the stop-here part on screen 3-3.", "#cw/07/3-3"),
     tryit("6-1.t3", "Choose the right radio button and press Check.",
           "The group box turns green and the score goes up by 1.", "Check the mark-it part on screen 3-4.", "#cw/07/3-4"),
     tryit("6-1.t4", "Set the right number on question 5 and press Check.",
           "The panel turns green and the Return button appears.", "Check screens 4-1 and 4-2.", "#cw/07/4-1"),
     tryit("6-1.t5", "Press Return.",
           "The quiz closes and the data entry screen comes back.", "Check the Return button on screen 5-1.", "#cw/07/5-1"),
     tryit("6-1.t6", "Start the quiz again. Press question 5's Check before question 4 is answered.",
           "Nothing happens, because the panel is grey.", "Check the Load event on screen 2-4.", "#cw/07/2-4", neg=True)]}
   ]}]}
 ]}

# ------------------------------------------------------------------ chapter 0
ch0 = {
 "id": "00", "n": 0, "of": 15, "title": "Start here: how this guide works", "kind": "start", "color": "#4F2D9E", "noTurn": True,
 "one": "What you are making, how a chapter works, and the three rules.",
 "prev": None, "next": {"id": "01", "n": 1, "title": "The login screen"},
 "methods": [],
 "stages": [
  {"id": "1", "title": "What you are making", "screens": [
   {"id": "1", "title": "Five screens, one program", "foot": "next", "blocks": [
    {"p": "On this screen you see the program you are finishing: five screens and one file."},
    {"words": [
      ["method", "A named block of code. The name runs it.", "1-2", False],
      ["event handler", "A method that runs when the user does something, like clicking a button.", "1-2", False],
      ["property", "A setting of a control, like its Text or whether it is locked.", "3-1", False],
      ["IntelliSense", "The list that drops down as you type code. It knows every name in your program.", "3-2", False]],
     "intro": "Four words you will meet in this chapter. Click any marked word to see what it means."},
    {"drawn": {"id": "five-screens", "alt": "Five cards: Login, Data entry, Quiz, Reaction test and Report, joined by arrows, with a note card for the file pupilStats.txt.",
               "say": "Each card is one window. The arrows are the buttons that move between them.",
               "cards": [["frmLogin", "Login", "Two boxes and a button."],
                         ["frmDataEntry", "Data entry", "Five panels, where everything is typed in."],
                         ["frmQuiz", "Quiz", "Five questions, one score."],
                         ["frmTest", "Reaction test", "Twelve pictures and a ten-second clock."],
                         ["frmReport", "Report", "A table of every saved pupil."],
                         ["pupilStats.txt", "The file", "One line per pupil, saved by the data entry screen."]]}},
    {"p": "The checklist on the home page shows which parts you have and which are left."},
    {"watch": "Every window has a name that starts with frm. You will see those names in the code."}
   ]},
   {"id": "2", "title": "Where everything lives", "foot": "next", "blocks": [
    {"p": "On this screen you find your forms, your code and the green Start arrow."},
    frames("F11", "Solution Explorer", [
      ("f11-1", "Solution Explorer on the right of Visual Studio 2019, listing the five forms and Global.cs", "Solution Explorer is on the right. Every form is listed, and Global.cs is with them."),
      ("f11-2", "The right-click menu of a form with View Code highlighted", "Double-click a form for its Design tab. Right-click it and choose View Code for its code.")]),
    {"p": "Each form has two tabs. The Design tab shows the window. The code tab shows its code."},
    {"p": "A [[method|0]] is a named block of code. A button's method is an [[event handler|1]], which means it runs when the button is clicked."},
    {"watch": "Closing a tab does not delete anything. Double-click the form in Solution Explorer to open it again."}
   ]},
   {"id": "3", "title": "Running your program", "foot": "next", "blocks": [
    {"p": "On this screen you run your program and stop it again."},
    frames("F9", "Running your program", [
      ("f9-1", "The toolbar with the green Start arrow", "The green Start arrow at the top runs your program."),
      ("f9-2", "The toolbar while the program runs, with the red Stop square", "While it runs, the arrow becomes a red Stop square. Press it to stop.")]),
    {"watch": "Use the green arrow and the menus, never the keyboard shortcuts. In a browser tab, a shortcut can reload the page and lose your place."}
   ]}]},
  {"id": "2", "title": "How a chapter works", "screens": [
   {"id": "1", "title": "What a chapter looks like", "foot": "next", "blocks": [
    {"p": "On this screen you learn how every chapter of this guide works."},
    {"drawn": {"id": "mini-chapter", "alt": "A small drawn chapter: a rail of stage pills, a list of three steps with tick boxes, and a big button at the foot.",
               "say": "A chapter is a row of stages. Each stage is a few screens. Each screen has one job."}},
    {"p": "Every chapter starts with Have you got this? It is a short check of what you need first."},
    {"p": "Then come the steps and the code, a screen at a time. The last screen is Try it."},
    {"p": "When you have done a screen, press the big button. It ticks the steps and moves you on."},
    {"watch": "Your ticks are saved to your school account. Next lesson, the guide opens where you left off."}
   ]},
   {"id": "2", "title": "If you were away", "foot": "next", "blocks": [
    {"p": "On this screen you learn what to do if you missed lessons."},
    {"p": "The home page is a checklist. Tick off what you have. Open the first chapter that is not ticked."},
    {"p": "Its first screen tells you what you need first. It also says where to go if you have not got it."},
    {"drawn": {"id": "home-card", "alt": "One chapter card from the home page: the number, the title, a progress ring, an Open button and a smaller I did this already button.",
               "say": "A chapter card. The ring fills as you tick. The small grey button is for work you did before."}},
    {"p": "Already finished a chapter before you saw this guide? Press I did this already on its card."},
    {"watch": "Only press I did this already if it is true. The guide checks nothing. Your program will."}
   ]}]},
  {"id": "3", "title": "The three rules", "screens": [
   {"id": "1", "title": "Rule 1: your names, not ours", "foot": "next", "blocks": [
    {"p": "On this screen you learn rule 1: your names are not our names."},
    {"p": "Every control in your program has a name, like tbxSurname or btnEnter. The code uses those names."},
    {"p": "This guide shows OUR names, from OUR example. YOUR names may be different, and that is fine."},
    frames("F2", "Finding a control's name", [
      ("f2-1", "The Design tab with one text box clicked once", "In the Design tab, click the control once."),
      ("f2-2", "The Properties window with the name tbxSurname at the top", "Look at the top of the Properties window. The name is written there, beside the word Name.")]),
    {"p": "The name is a [[property|2]] of the control, which means one of its settings. Its Text is another."},
    {"names": {"form": "frmDataEntry", "list": ["tbxSurname", "btnEnter", "pnlPupilDetails"]}},
    {"watch": "When the guide shows a name, read it as: the name YOU gave that control."}
   ]},
   {"id": "2", "title": "Rule 2: let IntelliSense finish the name", "foot": "next", "blocks": [
    {"p": "On this screen you learn rule 2: let Visual Studio finish the names for you."},
    {"p": "[[IntelliSense|3]] is the list that drops down as you type in the code. It knows every name in your program."},
    {"isense": {"form": "frmDataEntry", "typed": "pnl", "pick": "pnlPupilDetails",
                "list": ["pnlPupilDetails", "pnlQuizResult", "pnlReactionTest", "pnlSwimLengths", "pnlSwimmingGroup"]}},
    frames("F3", "The real list in Visual Studio 2019", [
      ("f3-1", "The code tab with pnl typed on a new line", "Type the first letters of the name."),
      ("f3-2", "The IntelliSense list open under pnl, showing the matching names", "The list appears with every matching name in YOUR program."),
      ("f3-3", "The line completed to a panel name", "Press Tab. The name is finished for you, spelt right.")]),
    {"watch": "If a name is not in the list, your control has a different name. Check it in the Properties window."}
   ]},
   {"id": "3", "title": "Rule 3: you type every line", "foot": "done", "blocks": [
    {"p": "On this screen you learn rule 3: you type every line yourself."},
    {"code": {"id": "3-3.c1", "kind": "type", "snippet": True, "title": "A three-line example, for practice only",
              "where": "nowhere yet. This one is only for trying the rule.", "lang": "cs",
              "text": "pnlPupilDetails.Enabled = false;\npnlSwimLengths.Enabled = true;\nbtnEnter.Visible = false;",
              "partLines": [[1, 3, "Three lines you will meet again", "Lock one panel, unlock the next, hide a button. Each line ends with a semicolon."]],
              "names": ["pnlPupilDetails", "pnlSwimLengths", "btnEnter"], "isense": ["pnlPupilDetails"]}},
    {"steps": [step("3-3.1", "Try to copy a line from the box above. Select it, right-click it, or drag it.",
                    "The guide says no, with a small message. Typing is how it sticks.")]},
    {"watch": "Read each line as you type it, so you know what it does."}
   ]},
   {"id": "4", "title": "When something goes red", "foot": "next", "blocks": [
    {"p": "On this screen you learn what a red underline means, and how to find the line."},
    {"p": "Red underline means the program does not understand that line yet. The Error List tells you which line."},
    frames("F10", "Finding an error", [
      ("f10-1", "A code line with a red wiggly underline under a misspelt name", "A red wiggly line under a word."),
      ("f10-2", "The Error List at the bottom of Visual Studio 2019 with one error", "The Error List at the bottom names the problem."),
      ("f10-3", "The cursor on the line after double-clicking the error", "Double-click the error. The cursor jumps to the line.")]),
    {"watch": "Most red lines are a name spelt differently from the control. Check the name in the Properties window."}
   ]},
   {"id": "5", "title": "Build before you run", "foot": "chapter-done", "blocks": [
    {"p": "On this screen you build your program and read the message at the bottom."},
    {"p": "Build before you run. Build succeeded means every line is understood."},
    frames("F12", "Building", [
      ("f12-1", "The Build menu open with Build Solution highlighted", "Open the Build menu and choose Build Solution."),
      ("f12-2", "The bottom left of Visual Studio 2019 saying Build succeeded", "Bottom left says Build succeeded.")]),
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

# ------------------------------------------------------------------ index from the spec briefs
spec = open(os.path.join(D, 'DESIGN_SPEC.md')).read().split('\n')[448:790]
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
    if n == 0:
        stages = [[s["id"], s["title"], len(s["screens"])] for s in ch0["stages"]]
    elif n == 7:
        stages = [[s["id"], s["title"], len(s["screens"])] for s in ch7["stages"]]
    else:
        names = {}
        for m in re.finditer(r'^- (\d{1,2}) (.+?)(?: — |$)', text, re.M): names[m.group(1)] = m.group(2).strip()
        counts = {}
        for m in re.finditer(r'\b(\d{1,2})-(\d{1,2})\b', text):
            s, k = m.group(1), int(m.group(2))
            if s in names: counts[s] = max(counts.get(s, 0), k)
        has_hygt = 'Have you got this?' in text and n != 14
        if has_hygt or n == 14: stages.append(["1", "Have you got this?" if has_hygt else "Before you start", 1])
        for s in sorted(names, key=int): stages.append([s, names[s], counts.get(s, 1)])
    entry = {"id": "%02d" % n, "n": n, "title": b["title"], "one": b["one"], "color": colors[n],
             "built": n in (0, 7), "steps": tick_ids(ch0) if n == 0 else tick_ids(ch7) if n == 7 else [],
             "stages": stages, "screens": sum(s[2] for s in stages)}
    if n == 14: entry["hidden"] = "after-all"
    chapters.append(entry)
index = {
 "intro": "Finish the coded front end of your Unit 5 program, one chapter at a time. Each chapter shows OUR example, explains every line, and says where YOUR program will differ.",
 "header": "Tick off what you have. Open the first chapter that is not ticked.",
 "expected": [1, 2, 3, 4, 5, 6],
 "chapters": chapters}

out = os.path.join(D, 'content')
for name, obj in (("ch00.json", ch0), ("ch07.json", ch7), ("index.json", index)):
    with open(os.path.join(out, name), 'w') as f: json.dump(obj, f, ensure_ascii=False, indent=1)
    print(name, 'written')
for c in chapters: print(' ', c["id"], c["title"][:34].ljust(34), 'stages', len(c["stages"]), 'screens', c["screens"], 'ticks', len(c["steps"]), c.get("hidden", ""))
