# Chapter 13, help buttons on every form (DESIGN_SPEC §9 ch13, voice §7a). Run by tools/build_content.py with its helpers.
D = 'frmDataEntry'
MSG = ("A note, then the message",
       "The note does not run. MessageBox.Show opens a small box with the words between the quote marks.")

def helpcode(id_, title, form, method, names=()):
    return code(id_, title, "between the curly brackets of " + method, form, method, 1, 5,
                [given(1, 2), [3, 4, MSG[0], MSG[1]], given(5, 5)], list(names), [])

def fold(title, where, blk):
    return {"box": {"title": title, "fold": True, "blocks": [{"p": where}, blk]}}

CH = {
 "id": "13", "n": 13, "of": 15, "title": "Help buttons on every form", "kind": "new", "color": "#5C6BC0",
 "one": "A question-mark button on each panel that says what to do.",
 "prev": {"id": "12", "n": 12, "title": "The report"},
 "next": {"id": "14", "n": 14, "title": "Push yourself: optional extras"},
 "methods": [["frmLogin", "btnHelp1_Click"], [D, "btnHelpPupilDetails_Click"], [D, "btnHelpQuizResult_Click"],
             [D, "btnHelpReactionTest_Click"], [D, "btnHelpSwimLengths_Click"], [D, "btnHelpSwimmingGroup_Click"],
             ["frmQuiz", "btnHelpQuizScore_Click"], ["frmTest", "btnHelpReactionTest_Click"]],
 "stages": [
  {"id": "1", "title": "Check what you need first", "screens": [
   {"id": "1", "title": "Check the parts this chapter needs", "foot": "have",
    "goal": "Before I start, I check that every panel and form has its own ? button.",
    "blocks": [
    {"p": "This chapter uses work from earlier chapters. This screen checks that it is there."},
    {"check": [
     have("1-1.t1", "Does every panel on frmDataEntry have a ? button, with a name that starts btnHelp?",
          "Open frmDataEntry in the Design tab. Click each ? button and look at its Name.", "Go to chapter 2, stage 3.", "#cw/02/3-1"),
     have("1-1.t2", "Does the login form have a ? button?",
          "Open frmLogin in the Design tab. Look for the ? button.", "Go to chapter 1, stage 2.", "#cw/01/2-1"),
     have("1-1.t3", "Does the quiz form have a ? button in its score panel?",
          "Open frmQuiz in the Design tab. Look inside the score panel.", "Go to chapter 6, stage 2.", "#cw/06/2-2"),
     have("1-1.t4", "Does the reaction test form have a ? button?",
          "Open frmTest in the Design tab. Look inside the score panel.", "Go to chapter 9, stage 3.", "#cw/09/3-3")]}
   ]}]},
  {"id": "2", "title": "One help button", "screens": [
   {"id": "1", "title": "Make the pupil details ? button speak", "foot": "done",
    "goal": "Clicking the ? in the pupil details panel shows a message that says what to do.",
    "blocks": [
    {"p": "In the Design tab, double-click the ? button in the pupil details panel. Its click code opens in the code tab."},
    helpcode("2-1.c1", "The pupil details help button", D, "btnHelpPupilDetails_Click"),
    {"watch": "Say what to DO, not what went wrong. Please enter ALL required details tells the pupil the next step."},
    {"yours": "MY message is Please enter ALL required details. Write YOUR message for YOUR panel, in one line."}
   ]}]},
  {"id": "3", "title": "The rest of the help buttons", "screens": [
   {"id": "1", "title": "Write the other four help messages on the data entry form", "foot": "done",
    "goal": "Each ? button on frmDataEntry shows its own message.",
    "blocks": [
    {"p": "Each one has the same shape as the last screen. Only the button and the words change. Do one, then open the next box below."},
    {"names": {"title": "The names from MY example", "form": D, "list": ["btnHelpSwimLengths", "btnHelpQuizResult", "btnHelpReactionTest", "btnHelpSwimmingGroup"]}},
    {"p": "In the Design tab, double-click the ? button in the attempts panel."},
    helpcode("3-1.c1", "The attempts help button", D, "btnHelpSwimLengths_Click"),
    fold("The quiz panel's ? button", "In the Design tab, double-click the ? button in the quiz panel.",
         helpcode("3-1.c2", "The quiz panel help button", D, "btnHelpQuizResult_Click")),
    fold("The test panel's ? button", "In the Design tab, double-click the ? button in the test panel.",
         helpcode("3-1.c3", "The test panel help button", D, "btnHelpReactionTest_Click")),
    fold("The group panel's ? button", "In the Design tab, double-click the ? button in the group panel.",
         helpcode("3-1.c4", "The group panel help button", D, "btnHelpSwimmingGroup_Click")),
    {"yours": "Write YOUR messages for YOUR panels, one line each. Each one says what to do in that panel."}
   ]},
   {"id": "2", "title": "Write the help messages on the login, quiz and test forms", "foot": "done",
    "goal": "The ? buttons on the login, quiz and test forms show their own messages.",
    "blocks": [
    {"p": "Same shape again, on three other forms. Open each form in the Design tab first."},
    {"names": {"title": "The names from MY example", "form": "frmLogin", "list": ["btnHelp1", "btnHelpQuizScore", "btnHelpReactionTest"]}},
    {"p": "Open frmLogin in the Design tab. Double-click its ? button."},
    helpcode("3-2.c1", "The login help button", "frmLogin", "btnHelp1_Click"),
    fold("The quiz form's ? button", "Open frmQuiz in the Design tab. Double-click the ? button in the score panel.",
         helpcode("3-2.c2", "The quiz form help button", "frmQuiz", "btnHelpQuizScore_Click")),
    fold("The test form's ? button", "Open frmTest in the Design tab. Double-click its ? button.",
         helpcode("3-2.c3", "The test form help button", "frmTest", "btnHelpReactionTest_Click")),
    {"watch": "frmDataEntry and frmTest both have a btnHelpReactionTest. Each form keeps its own code, so the two do not clash."},
    {"yours": "Write YOUR messages for YOUR forms, one line each."}
   ]},
   {"id": "3", "title": "Try every help button", "foot": "chapter-done",
    "goal": "I run the program and click every ? button, and a locked one does nothing.",
    "blocks": [
    {"p": "Run your program. Then try each row."},
    {"check": [
     tryit("3-3.t1", "On the login form, click ?.", "YOUR login message shows. Click OK to close it.", "Look at screen 3-2.", "#cw/13/3-2"),
     tryit("3-3.t2", "Log in. Click the ? in the pupil details panel.", "YOUR message for that panel shows.", "Look at screen 2-1.", "#cw/13/2-1"),
     tryit("3-3.t3", "Work through the panels. Click each ? while its panel is on.", "Each panel shows its own message.", "Look at screen 3-1.", "#cw/13/3-1"),
     tryit("3-3.t4", "Take the quiz and the test. Click the ? on each form.", "Each form shows its own message.", "Look at screen 3-2.", "#cw/13/3-2"),
     tryit("3-3.t5", "Click Calculate in the group panel. When the group appears, the panel goes grey. Click its ? now.", "Nothing must happen, because the whole panel is switched off.", "If a message shows, look at chapter 10, screen 3-7.", "#cw/10/3-7", neg=True)]}
   ]}]}
 ]}
