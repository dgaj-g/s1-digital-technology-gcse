# Chapter 1, the login form (DESIGN_SPEC §9 ch01, voice §7a). Run by tools/build_content.py with its helpers.
L = 'frmLogin'
CH = {
 "id": "01", "n": 1, "of": 15, "title": "The login form", "kind": "expected", "color": "#E84D6A",
 "one": "Two boxes, one button, and the code that checks them.",
 "prev": {"id": "00", "n": 0, "title": "Start here: how to use this guide"},
 "next": {"id": "02", "n": 2, "title": "The data entry form: its panels and boxes"},
 "methods": [["frmLogin", "btnLogin_Click"]],
 "stages": [
  {"id": "1", "title": "Check what your login form has", "screens": [
   {"id": "1", "title": "Check what your login form already has", "foot": "have",
    "goal": "I check my login form for its two boxes, the Login button, the star in the password box and the Login button's code.",
    "blocks": [
    {"p": "Your login form may be partly made already. This screen checks what is there."},
    {"check": [
     have("1-1.t1", "Open frmLogin in the Design tab. Does it have two text boxes, a Login button and two labels?",
          "Solution Explorer is on the right. Double-click frmLogin to see it in the Design tab.", "Go to stage 2.", "#cw/01/2-1"),
     have("1-1.t2", "Click the password box once. In Properties, is PasswordChar a star?",
          "Properties is on the right, under Solution Explorer. PasswordChar is in the list in A to Z order.", "Go to stage 2, screen 3.", "#cw/01/2-3"),
     have("1-1.t3", "Double-click the Login button. Is there code between its two curly brackets?",
          "The code tab opens at btnLogin_Click. Lines between the curly brackets mean yes.", "Go to stage 3.", "#cw/01/3-1"),
     have("1-1.t4", "Run it with the green Start arrow. Do wrong details give a message, and the right ones open the data entry form?",
          "Type a wrong password first. Then type the right username and password.", "Go to stage 3.", "#cw/01/3-1")]},
    {"box": {"title": "Not sure where to look?", "fold": True,
             "text": "Solution Explorer is on the right of Visual Studio 2019. It lists every form. Double-click frmLogin to see it in the Design tab."}}
   ]}]},
  {"id": "2", "title": "The two boxes and the button", "screens": [
   {"id": "1", "title": "Put the boxes, labels and buttons on the login form", "foot": "done",
    "goal": "My login form has a panel holding two text boxes, a Login button and their labels, plus a title and a ? button.",
    "blocks": [
    {"p": "The login form holds a panel. The title, two labels, two boxes and the Login button go inside it."},
    {"p": "The Toolbox is down the left side of Visual Studio. It lists the controls you can drag."},
    {"p": "Drag each one from the Toolbox onto the form. Do them in the order of this table."},
    {"controls": {"form": L, "rows": [
      {"toolbox": "Panel", "name": "pnlLogin", "set": []},
      {"toolbox": "Label", "name": "lblTitle", "set": ["Text = Login Form"]},
      {"toolbox": "Label", "name": "lblUsername", "set": ["Text = Enter Username"]},
      {"toolbox": "TextBox", "name": "tbxUsername", "set": []},
      {"toolbox": "Label", "name": "lblPassword", "set": ["Text = Enter Password"]},
      {"toolbox": "TextBox", "name": "tbxPassword", "set": []},
      {"toolbox": "Button", "name": "btnLogin", "set": ["Text = Login"]},
      {"toolbox": "Label", "name": "lblSubtitle", "set": ["Text = Swimming club records"]},
      {"toolbox": "Button", "name": "btnHelp1", "set": ["Text = ?"]}],
     "done": "Every row from lblTitle to btnLogin sits inside the panel. lblSubtitle and the ? button sit outside it."}},
    {"watch": "Drop every row from lblTitle down to btnLogin INSIDE the panel. lblSubtitle and btnHelp1 go outside it."}
   ]},
   {"id": "2", "title": "Give every control its name", "foot": "done",
    "goal": "I name a control by clicking it once and typing its name beside Name near the top of Properties.",
    "blocks": [
    {"p": "Every control you dragged on needs its name. The name is how your code finds it."},
    frames("F2", "Give a control its name", [
      ("f2-1", "A text box on the login form clicked once, with its handles showing", "Click the control once. Little squares appear round it."),
      ("f2-2", "The Properties window with the Name line near the top", "In Properties, find the word Name. It is near the top of the list."),
      ("f2-3", "The Name line in Properties changed to tbxUsername", "Type the new name and press Enter.")]),
    {"p": "Do this for every row of the table on the screen before. Give yours the names YOU choose."},
    {"p": "Start each name with three letters for its kind. pnl is a panel, lbl a label, tbx a text box, btn a button."},
    {"watch": "A name has no spaces. Two controls can never have the same name."}
   ]},
   {"id": "3", "title": "Make the password show stars", "foot": "done",
    "goal": "Setting PasswordChar to a star on tbxPassword makes every letter typed in it show as a star.",
    "blocks": [
    {"p": "Nobody should see a password as it is typed. One setting in Properties turns every letter into a star."},
    {"steps": [
     step("2-3.1", "In the Design tab, click the password box once.",
          "Little squares appear round the password box."),
     step("2-3.2", "In Properties, find PasswordChar. In the box beside it, type the star sign * and press Enter.",
          "PasswordChar shows *.",
          None, [["I cannot find PasswordChar.", "The list is in A to Z order. Scroll down to the letter P."],
                 ["I cannot find the star sign.", "Hold Shift and press the 8 key at the top of the keyboard."]])]},
    {"p": "The ? button does nothing yet. You make it work in chapter 13."},
    {"watch": "Put the star on the PASSWORD box, not the username box."}
   ]}]},
  {"id": "3", "title": "The code behind the Login button", "screens": [
   {"id": "1", "title": "Stop a username that is too long", "foot": "done",
    "goal": "If the username is more than 15 letters, a message appears and both boxes are emptied.",
    "blocks": [
    {"p": "The Login button checks what was typed. First it checks that the username is not too long."},
    {"words": [
      [".Text", "The words it shows.", "3-1", True],
      [".Length", "How many characters.", "3-1", True],
      ["==", "Is the same as.", "3-2", True],
      ["&&", "And.", "3-2", True],
      ["this.Hide()", "Hide this form but keep it.", "3-2", True]],
     "intro": "Five new things in this chapter. Click any marked word to see what it means."},
    {"steps": [step("3-1.1", "In the Design tab, double-click the Login button.", "The code tab opens at btnLogin_Click, empty between the curly brackets.")]},
    {"box": {"title": "See it in Visual Studio", "fold": True, "blocks": [
      frames("F1", "From the button to its code", [
        ("f1-1", "The pointer on the Login button in the Design tab", "Double-click the Login button in the Design tab."),
        ("f1-2", "The code tab with the new empty btnLogin_Click", "The code tab opens. Visual Studio has written btnLogin_Click for you.")])]}},
    {"p": "[[.Text|0]] is what was typed in a box. [[.Length|1]] counts its characters. .Clear() empties a box."},
    code("3-1.c1", "The Login button, part 1 of 3", "between the curly brackets of btnLogin_Click, in frmLogin.cs", L, "btnLogin_Click", 1, 10,
         [given(1, 2),
          [3, 5, "Too long?", "The line with two slashes is a note for you. The computer skips it. Then it asks: is the username more than 15 letters?"],
          [6, 10, "Say so and empty both boxes", "A message box pops up and tells the user. Then both boxes are emptied."]],
         ["tbxUsername", "tbxPassword"], ["tbxUsername", "tbxPassword"]),
    {"watch": "Leave the last curly bracket of btnLogin_Click where it is. The code on the next two screens goes above it."}
   ]},
   {"id": "2", "title": "Let the right username and password in", "foot": "done",
    "goal": "If the username and password are both right, a message appears, the login form hides and the data entry form opens.",
    "blocks": [
    {"p": "Next the code asks: are the username and the password both right?"},
    {"p": "else if means: if the first question was no, ask this question instead."},
    {"p": "[[==|2]] asks if two things are the same. [[&&|3]] means both must be true."},
    code("3-2.c1", "The Login button, part 2 of 3", "under part 1, inside btnLogin_Click, in frmLogin.cs", L, "btnLogin_Click", 11, 18,
         [[11, 14, "The right details?", "A note, then the question. Is the username jsmith AND is the password Password1?"],
          [15, 18, "Let them in", "A message box says so. The login form hides. A new data entry form opens."]],
         ["tbxUsername", "tbxPassword", "frmDataEntry"], ["tbxPassword"],
         yours="MY username is jsmith and MY password is Password1. YOURS are the ones YOUR task sheet gives you."),
    {"p": "[[this.Hide()|4]] hides the login form. The last line makes a new data entry form and shows it."},
    {"p": "frmDataEntry is the data entry form. You make it in chapter 2. Until it is made, frmDataEntry has a red line under it."},
    {"watch": "Two equals signs, not one. One equals sign would try to change the box."}
   ]},
   {"id": "3", "title": "Show Login incorrect when the details are wrong", "foot": "done",
    "goal": "If the details are anything else, a Login incorrect message appears and both boxes are emptied.",
    "blocks": [
    {"p": "Last, the code deals with anything else. That means a wrong username or a wrong password."},
    code("3-3.c1", "The Login button, part 3 of 3", "under part 2, inside btnLogin_Click, in frmLogin.cs", L, "btnLogin_Click", 19, 29,
         [[19, 23, "Anything else", "else catches every other case. Then a note for you."],
          [24, 28, "Say so and empty both boxes", "A message box says Login incorrect. Both boxes are emptied."],
          given(29, 29)],
         ["tbxUsername", "tbxPassword"], ["tbxUsername"]),
    {"watch": "The else has no question after it. It runs when the two questions above were both false."}
   ]}]},
  {"id": "4", "title": "Try your login form", "screens": [
   {"id": "1", "title": "Try every way into your login form", "foot": "chapter-done",
    "goal": "I run the program and try a long username, a wrong password, the right details and two empty boxes.",
    "blocks": [
    {"p": "Run your program and try each row. Tick the rows that work. A row that fails tells you where to look."},
    {"p": "No data entry form yet? The program will not start without it. Make it in chapter 2, then come back."},
    {"check": [
     tryit("4-1.t1", "Type a username of 16 letters and press Login.",
           "The message says the username has exceeded the maximum number of characters.", "Look at part 1 on screen 3-1.", "#cw/01/3-1"),
     tryit("4-1.t2", "Type the right username and a wrong password. Press Login.",
           "The message says Login incorrect. Both boxes are empty.", "Look at part 3 on screen 3-3.", "#cw/01/3-3"),
     tryit("4-1.t3", "Type the right username and password. Press Login.",
           "The login form goes and the data entry form opens.", "Look at part 2 on screen 3-2.", "#cw/01/3-2"),
     tryit("4-1.t4", "Leave both boxes empty and press Login.",
           "The data entry form must NOT open. The Login incorrect message appears.", "If the data entry form opened, look at the question in part 2 on screen 3-2.", "#cw/01/3-2", neg=True)]}
   ]}]}
 ]}
