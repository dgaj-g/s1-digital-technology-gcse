# Chapter 2, the data entry form's panels and boxes (DESIGN_SPEC §9 ch02, voice §7a). No code. Run by tools/build_content.py.
D = 'frmDataEntry'
DDL = 'DropDownStyle = DropDownList'
CH = {
 "id": "02", "n": 2, "of": 15, "title": "The data entry form: its panels and boxes", "kind": "expected", "color": "#F28C28",
 "one": "Five panels, two buttons, and a name on every control.",
 "prev": {"id": "01", "n": 1, "title": "The login form"},
 "next": {"id": "03", "n": 3, "title": "Global.cs: the file that remembers things between forms"},
 "methods": [],
 "stages": [
  {"id": "1", "title": "Check what your data entry form has", "screens": [
   {"id": "1", "title": "Check what your data entry form already has", "foot": "have",
    "goal": "I check my data entry form for its five panels, their names, the Save and View Report buttons and the year group list.",
    "blocks": [
    {"p": "Your data entry form may be partly made already. This screen checks what is there."},
    {"check": [
     have("1-1.t1", "Open frmDataEntry in the Design tab. Does it have five panels?",
          "They hold the pupil details, three attempts, the quiz, the reaction test and the group.", "Go to stage 2.", "#cw/02/2-1"),
     have("1-1.t2", "Click the edge of each panel once. In Properties, does its Name start with pnl?",
          "The Name line is near the top of Properties.", "Go to stage 2, screen 2.", "#cw/02/2-2"),
     have("1-1.t3", "Under the panels, are there two big buttons, Save Details and View Report?",
          "They sit on the form itself, outside the five panels.", "Go to stage 3, screen 5.", "#cw/02/3-5"),
     have("1-1.t4", "Click the year group list once. In Properties, click Items. Are the year groups in it?",
          "Items opens a box with one choice on each line.", "Go to stage 3, screen 2.", "#cw/02/3-2")]}
   ]}]},
  {"id": "2", "title": "The five panels", "screens": [
   {"id": "1", "title": "See the five panels on the data entry form", "foot": "next",
    "goal": "The data entry form holds five panels: pupil details, three attempts, the quiz, the reaction test and the group.",
    "blocks": [
    {"p": "The data entry form is where a user types in one pupil. It holds five panels."},
    {"flow": {"form": D, "map": True,
              "lit": ["pnlPupilDetails", "pnlSwimLengths", "pnlQuizResult", "pnlReactionTest", "pnlSwimmingGroup"], "then": [],
              "say": "Five panels: pupil details, three attempts, the quiz, the reaction test and the group."}},
    {"p": "Each panel holds the controls for one job. The Save and View Report buttons sit under them."},
    {"yours": "In MY example the second panel holds three swim lengths. YOURS holds whatever YOUR task measures three times. Name the panel for what it holds."}
   ]},
   {"id": "2", "title": "Put on the five panels and name each one", "foot": "done",
    "goal": "I drag five panels onto the data entry form and give each one a name that starts with pnl.",
    "blocks": [
    {"p": "Make the panels first. The boxes and buttons go inside them on the next screens."},
    {"steps": [
     step("2-2.1", "In Solution Explorer, double-click frmDataEntry. It opens in the Design tab.",
          "The data entry form, empty or partly made."),
     step("2-2.2", "Drag a Panel from the Toolbox onto the form. The Toolbox is down the left side. Drag the corner to make it bigger.",
          "A box with a dotted edge sits on the form."),
     step("2-2.3", "Click the panel's edge once. In Properties, find the word Name. Type its new name and press Enter.",
          "The Name line shows the new name, like pnlPupilDetails.",
          None, [["Clicking the middle picks the wrong thing.", "Click the dotted EDGE of the panel, not the middle."]]),
     step("2-2.4", "Do the same for the other four panels.",
          "Five panels, each with a name that starts with pnl.")]},
    {"box": {"title": "See it in Visual Studio", "fold": True, "blocks": [
      frames("F2", "Give a control its name", [
        ("f2-1", "A control on the form clicked once, with its handles showing", "Click the control once. Little squares appear round it."),
        ("f2-2", "The Properties window with the Name line near the top", "In Properties, find the word Name. It is near the top of the list."),
        ("f2-3", "The Name line in Properties changed to a new name", "Type the new name and press Enter.")])]}},
    {"watch": "MY panel names are pnlPupilDetails, pnlSwimLengths, pnlQuizResult, pnlReactionTest and pnlSwimmingGroup. Name YOURS for what they hold."}
   ]}]},
  {"id": "3", "title": "Inside each panel", "screens": [
   {"id": "1", "title": "Fill the pupil details panel", "foot": "done",
    "goal": "The pupil details panel holds a first name box, a surname box, a gender list, a year group list, an Enter button and a ? button.",
    "blocks": [
    {"p": "The first panel holds the pupil's name, gender and year group. Drag each row INSIDE pnlPupilDetails."},
    {"p": "A ComboBox is a drop-down list. DropDownList means the user can only pick. They cannot type their own."},
    {"controls": {"form": D, "rows": [
      {"toolbox": "Label", "name": "lblPupilDetails", "set": ["Text = Pupil Details"]},
      {"toolbox": "Label", "name": "lblFirstName", "set": ["Text = First Name"]},
      {"toolbox": "TextBox", "name": "tbxFirstName", "set": []},
      {"toolbox": "Label", "name": "lblSurname", "set": ["Text = Surname"]},
      {"toolbox": "TextBox", "name": "tbxSurname", "set": []},
      {"toolbox": "Label", "name": "lblGender", "set": ["Text = Gender"]},
      {"toolbox": "ComboBox", "name": "cbxGender", "set": [DDL]},
      {"toolbox": "Label", "name": "lblYeargroup", "set": ["Text = Yeargroup"]},
      {"toolbox": "ComboBox", "name": "cbxYeargroup", "set": [DDL]},
      {"toolbox": "Button", "name": "btnEnter", "set": ["Text = Enter"]},
      {"toolbox": "Button", "name": "btnHelpPupilDetails", "set": ["Text = ?"]}],
     "done": "Two boxes, two drop-down lists, their labels and two buttons sit inside the pupil details panel."}}
   ]},
   {"id": "2", "title": "Put the choices in the two drop-down lists", "foot": "done",
    "goal": "The year group list and the gender list each hold their choices, typed one per line in Items.",
    "blocks": [
    {"p": "A drop-down list is empty until you give it its choices. They go in Items, one per line."},
    {"steps": [
     step("3-2.1", "In the Design tab, click the year group list once.",
          "Little squares appear round the year group list."),
     step("3-2.2", "In Properties, find Items. Click the three dots beside it.",
          "A box opens for typing the choices."),
     step("3-2.3", "Type one choice on each line. Then click OK.",
          "Items now says Collection.",
          None, [["All my choices show on one line.", "Press Enter after each choice, so each one has its own line."]]),
     step("3-2.4", "Do the same for the gender list.",
          "Both lists now hold their choices.")]},
    {"yours": "MY year group list holds 11, 12, 13 and 14. YOURS holds the choices YOUR task sheet gives you. So does YOUR gender list."}
   ]},
   {"id": "3", "title": "Fill the three attempts panel", "foot": "done",
    "goal": "The second panel holds three attempt boxes with labels, a Calculate Average button, a box for the average and a ? button.",
    "blocks": [
    {"p": "The second panel holds three attempts and their average. Drag each row INSIDE pnlSwimLengths."},
    {"controls": {"form": D, "rows": [
      {"toolbox": "Label", "name": "lblSwimLengths", "set": ["Text = Swim lengths"]},
      {"toolbox": "Label", "name": "lblAttempt1", "set": ["Text = Attempt 1"]},
      {"toolbox": "TextBox", "name": "tbxAttempt1", "set": []},
      {"toolbox": "Label", "name": "lblAttempt2", "set": ["Text = Attempt 2"]},
      {"toolbox": "TextBox", "name": "tbxAttempt2", "set": []},
      {"toolbox": "Label", "name": "lblAttempt3", "set": ["Text = Attempt 3"]},
      {"toolbox": "TextBox", "name": "tbxAttempt3", "set": []},
      {"toolbox": "Button", "name": "btnCalculateAverage", "set": ["Text = Calculate Average"]},
      {"toolbox": "TextBox", "name": "tbxCalculateAverage", "set": []},
      {"toolbox": "Button", "name": "btnHelpSwimLengths", "set": ["Text = ?"]}],
     "done": "Three attempt boxes, the average box and two buttons sit inside the second panel."}},
    {"p": "The Calculate Average button does nothing yet. You make it work in chapter 5."}
   ]},
   {"id": "4", "title": "Fill the quiz panel and the reaction test panel", "foot": "done",
    "goal": "The quiz panel and the test panel each hold a heading, a not taken yet label, a Take button and a ? button.",
    "blocks": [
    {"p": "These two panels look alike. Each one has a heading, a line that says not taken yet, and two buttons."},
    {"controls": {"form": D, "rows": [
      {"toolbox": "Label", "name": "lblQuizResult", "set": ["Text = Quiz Result"]},
      {"toolbox": "Label", "name": "lblQuizStatus", "set": ["Text = Quiz not taken yet"]},
      {"toolbox": "Button", "name": "btnTakeQuiz", "set": ["Text = Take Quiz"]},
      {"toolbox": "Button", "name": "btnHelpQuizResult", "set": ["Text = ?"]},
      {"toolbox": "Label", "name": "lblReactionTest", "set": ["Text = Reaction Test"]},
      {"toolbox": "Label", "name": "lblTestStatus", "set": ["Text = Test not taken yet"]},
      {"toolbox": "Button", "name": "btnTakeTest", "set": ["Text = Take Test"]},
      {"toolbox": "Button", "name": "btnHelpReactionTest", "set": ["Text = ?"]}],
     "done": "The first four rows sit inside pnlQuizResult. The last four sit inside pnlReactionTest."}},
    {"watch": "The first four rows go in the QUIZ panel. The last four go in the TEST panel."}
   ]},
   {"id": "5", "title": "Fill the group panel and add the two big buttons", "foot": "done",
    "goal": "The group panel holds a heading, a box, a button and a ? button. Save Details, View Report, a title and a logo sit on the form.",
    "blocks": [
    {"p": "The first four rows go INSIDE pnlSwimmingGroup. The rest sit on the form, outside every panel."},
    {"p": "A PictureBox shows a picture. StretchImage makes the picture fill the whole box."},
    {"controls": {"form": D, "rows": [
      {"toolbox": "Label", "name": "lblSwimmingGroup", "set": ["Text = Swimming Group"]},
      {"toolbox": "TextBox", "name": "tbxSwimmingGroup", "set": []},
      {"toolbox": "Button", "name": "btnCalculateSwimmingGroup", "set": ["Text = Calculate Swim Group"]},
      {"toolbox": "Button", "name": "btnHelpSwimmingGroup", "set": ["Text = ?"]},
      {"toolbox": "Button", "name": "btnSaveDetails", "set": ["Text = Save Details"]},
      {"toolbox": "Button", "name": "btnViewReport", "set": ["Text = View Report"]},
      {"toolbox": "Label", "name": "lblTitle2", "set": ["Text = Pupil Data Input"]},
      {"toolbox": "PictureBox", "name": "pbxLogo3", "set": ["SizeMode = StretchImage"]}],
     "done": "Four rows sit inside the group panel. Two big buttons, the title and the logo sit on the form."}},
    {"p": "To put a picture in the logo, click the three dots beside Image in Properties."},
    {"p": "Click Import and pick the logo picture saved in YOUR coursework folder. Then click OK."},
    {"p": "Every ? button has a name that starts btnHelp. You make them all work in chapter 13."}
   ]}]},
  {"id": "4", "title": "Try it in the Design tab", "screens": [
   {"id": "1", "title": "Check every name on your data entry form", "foot": "chapter-done",
    "goal": "Every panel name starts pnl, every text box tbx, every button btn and every drop-down list cbx. None is a made-up name.",
    "blocks": [
    {"p": "A wrong name stops your code finding a control later. Click each control once and read its Name."},
    {"check": [
     tryit("4-1.t1", "Every panel's name starts with pnl.", "Click the dotted edge of each panel once.",
           "Go back to stage 2, screen 2.", "#cw/02/2-2", design=True),
     tryit("4-1.t2", "Every text box's name starts with tbx.", "Click each white box once.",
           "Go back to stage 3.", "#cw/02/3-1", design=True),
     tryit("4-1.t3", "Every button's name starts with btn, and every drop-down list's name starts with cbx.", "Click each button and each list once.",
           "Go back to stage 3.", "#cw/02/3-1", design=True),
     tryit("4-1.t4", "Click any control once and read its Name.",
           "It must NOT be a made-up name like textBox1 or panel3.", "Give it a real name, as on stage 2, screen 2.", "#cw/02/2-2", neg=True, design=True)]}
   ]}]}
 ]}
