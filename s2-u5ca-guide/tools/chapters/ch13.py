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
  {"id": "1", "title": "Check what you need first", "thing": "the parts this chapter needs", "verb": "checking", "screens": [
   {"id": "1", "title": "Check the parts this chapter needs", "foot": "have", "done": "every row is ticked, or you have gone where its link says",
    "goal": "Before I start, I check that every panel and form has its own ? button.",
    "blocks": [
    {"p": "This chapter uses work from earlier chapters, so this screen checks that it is there."},
    {"check": [
     have("1-1.t1", "Does every panel on frmDataEntry have a ? button, with a name that starts btnHelp?",
          "Open frmDataEntry in the Design tab. Click each ? button and look at its Name.", "Go to chapter 2, part 3.", "#cw/02/3-1"),
     have("1-1.t2", "Does the login form have a ? button?",
          "Open frmLogin in the Design tab. Look for the ? button.", "Go to chapter 1, part 2.", "#cw/01/2-1"),
     have("1-1.t3", "Does the quiz form have a ? button in its score panel?",
          "Open frmQuiz in the Design tab. Look inside the score panel.", "Go to chapter 6, part 2.", "#cw/06/2-3"),
     have("1-1.t4", "Does the reaction test form have a ? button?",
          "Open frmTest in the Design tab. Look inside the score panel.", "Go to chapter 9, part 3.", "#cw/09/3-3")]}
   ]}]},
  {"id": "2", "title": "One help button", "thing": "the first help button", "verb": "making", "screens": [
   {"id": "1", "title": "Make the pupil details ? button speak", "foot": "done", "done": "lines 3 and 4 are typed and YOUR message is between the quote marks",
    "goal": "Clicking the ? in the pupil details panel shows a message that says what to do.",
    "blocks": [
    {"p": "In the Design tab, double-click the ? button in the pupil details panel."},
    {"p": "Its click code opens in the code tab."},
    helpcode("2-1.c1", "The pupil details help button", D, "btnHelpPupilDetails_Click", ["btnHelpPupilDetails"]),
    {"watch": "Say what to DO, not what went wrong. Please enter ALL required details tells the pupil the next step."},
    {"yours": "MY message is Please enter ALL required details. Write YOUR message for YOUR panel, in one line."}
   ]}]},
  {"id": "3", "title": "The other help buttons on the data entry form", "thing": "the other four data entry help buttons", "verb": "making", "screens": [
   opener("Make the other four data entry ? buttons speak", "This part gives the attempts, quiz, test and group panels their own help messages.",
          "Four more ? buttons sit on frmDataEntry, one in each panel. Each one gets the same two lines with its own words.",
          "When it works, every panel's ? button shows a message that says what to do there."),
   {"id": "1", "title": "Make the attempts ? button speak", "foot": "done", "done": "lines 3 and 4 are typed and YOUR message is between the quote marks",
    "goal": "The ? in the attempts panel shows its own message.",
    "blocks": [
    {"p": "In the Design tab, double-click the ? button in the attempts panel."},
    helpcode("3-1.c1", "The attempts help button", D, "btnHelpSwimLengths_Click", ["btnHelpSwimLengths"]),
    {"yours": "Write YOUR message for YOUR attempts panel, in one line. It says what to do there."}
   ]},
   {"id": "2", "title": "Make the quiz panel ? button speak", "foot": "done", "done": "lines 3 and 4 are typed and YOUR message is between the quote marks",
    "goal": "The ? in the quiz panel shows its own message.",
    "blocks": [
    {"p": "In the Design tab, double-click the ? button in the quiz panel."},
    helpcode("3-1.c2", "The quiz panel help button", D, "btnHelpQuizResult_Click", ["btnHelpQuizResult"]),
    {"yours": "Write YOUR message for YOUR quiz panel, in one line. It says what to do there."}
   ]},
   {"id": "3", "title": "Make the test panel ? button speak", "foot": "done", "done": "lines 3 and 4 are typed and YOUR message is between the quote marks",
    "goal": "The ? in the test panel shows its own message.",
    "blocks": [
    {"p": "In the Design tab, double-click the ? button in the test panel."},
    helpcode("3-1.c3", "The test panel help button", D, "btnHelpReactionTest_Click", ["btnHelpReactionTest"]),
    {"yours": "Write YOUR message for YOUR test panel, in one line. It says what to do there."}
   ]},
   {"id": "4", "title": "Make the group panel ? button speak", "foot": "done", "done": "lines 3 and 4 are typed and YOUR message is between the quote marks",
    "goal": "The ? in the group panel shows its own message.",
    "blocks": [
    {"p": "In the Design tab, double-click the ? button in the group panel."},
    helpcode("3-1.c4", "The group panel help button", D, "btnHelpSwimmingGroup_Click", ["btnHelpSwimmingGroup"]),
    {"yours": "Write YOUR message for YOUR group panel, in one line. It says what to do there."}
   ]}]},
  {"id": "4", "title": "The help buttons on the other three forms", "thing": "the login, quiz and test help buttons", "verb": "making", "screens": [
   opener("Make the ? buttons on the other three forms speak", "This part gives the login, quiz and test forms their help messages.",
          "The login, quiz and test forms each have a ? button too. Open each form in the Design tab first.",
          "When it works, every form in your program has a ? button that speaks."),
   {"id": "1", "title": "Make the login ? button speak", "foot": "done", "done": "lines 3 and 4 are typed and YOUR message is between the quote marks",
    "goal": "The ? on the login form shows its own message.",
    "blocks": [
    {"p": "Open frmLogin in the Design tab and double-click its ? button."},
    helpcode("3-2.c1", "The login help button", "frmLogin", "btnHelp1_Click", ["btnHelp1"]),
    {"yours": "Write YOUR login message in one line. It says what to type to get in."}
   ]},
   {"id": "2", "title": "Make the quiz form ? button speak", "foot": "done", "done": "lines 3 and 4 are typed and YOUR message is between the quote marks",
    "goal": "The ? on the quiz form shows its own message.",
    "blocks": [
    {"p": "Open frmQuiz in the Design tab and double-click the ? button in the score panel."},
    helpcode("3-2.c2", "The quiz form help button", "frmQuiz", "btnHelpQuizScore_Click", ["btnHelpQuizScore"]),
    {"yours": "Write YOUR quiz message in one line. It says what to do on the quiz."}
   ]},
   {"id": "3", "title": "Make the test form ? button speak", "foot": "done", "done": "lines 3 and 4 are typed and YOUR message is between the quote marks",
    "goal": "The ? on the test form shows its own message.",
    "blocks": [
    {"p": "Open frmTest in the Design tab and double-click its ? button."},
    helpcode("3-2.c3", "The test form help button", "frmTest", "btnHelpReactionTest_Click", ["btnHelpReactionTest"]),
    {"watch": "frmDataEntry and frmTest both have a btnHelpReactionTest. Each form keeps its own code, so the two do not clash."},
    {"yours": "Write YOUR test message in one line. It says what to do in the test."}
   ]}]},
  {"id": "5", "title": "Try it", "thing": "your help buttons", "verb": "testing", "screens": [
   {"id": "1", "title": "Try every help button", "foot": "chapter-done", "done": "every row is ticked, or you have gone where its link says",
    "goal": "I run the program and click every ? button, and a locked one does nothing.",
    "blocks": [
    {"p": "Run your program and then try each row."},
    {"check": [
     tryit("3-3.t1", "On the login form, click ?.", "YOUR login message shows. Click OK to close it.", "Look at the code on screen 4-1.", "#cw/13/4-1"),
     tryit("3-3.t2", "Log in. Click the ? in the pupil details panel.", "YOUR message for that panel shows.", "Look at the code on screen 2-1.", "#cw/13/2-1"),
     tryit("3-3.t3", "Work through the panels. Click each ? while its panel is on.", "Each panel shows its own message.", "Look at the code on screens 3-1 to 3-4.", "#cw/13/3-1"),
     tryit("3-3.t4", "Take the quiz and the test. Click the ? on each form.", "Each form shows its own message.", "Look at the code on screens 4-2 and 4-3.", "#cw/13/4-2"),
     tryit("3-3.t5", "Click Calculate in the group panel. When the group appears, the panel goes grey. Click its ? now.", "Nothing must happen, because the whole panel is switched off.", "If a message shows, look at the code on chapter 10, screen 3-8.", "#cw/10/3-8", neg=True)]}
   ]}]}
 ]}
