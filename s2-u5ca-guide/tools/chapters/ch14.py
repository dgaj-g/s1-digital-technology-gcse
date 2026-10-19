# Chapter 14, push yourself: optional extras (DESIGN_SPEC §9 ch14, voice §7a). Hidden until 1-13 are done. No method of the sample:
# every code block here is a snippet, so none of it counts for coverage.
def snip(id_, title, where, text, parts, names):
    return {"code": {"id": id_, "kind": "type", "snippet": True, "title": title, "lang": "cs", "where": where,
                     "text": text, "partLines": parts, "names": names, "isense": []}}

CH = {
 "id": "14", "n": 14, "of": 15, "title": "Push yourself: optional extras", "kind": "new", "color": "#C9A227",
 "one": "Four extras for anyone who wants more. None of them is needed.",
 "prev": {"id": "13", "n": 13, "title": "Help buttons on every form"},
 "methods": [],
 "stages": [
  {"id": "1", "title": "Read this first", "screens": [
   {"id": "1", "title": "Read this before you pick an extra", "foot": "next",
    "goal": "Everything my program needs is done. I can pick any extra, or none.",
    "blocks": [
    {"p": "Everything your program needs is done. This chapter is for fun."},
    {"p": "Pick any one. Skip any one. Nothing here is marked."},
    {"p": "Each extra has two screens. The first gives the code. The second is its own Try it."},
    {"watch": "Save your project before you start an extra. Then you can always go back."}
   ]}]},
  {"id": "2", "title": "Login: three tries, then no more", "screens": [
   {"id": "1", "title": "Add a counter for wrong tries", "foot": "done",
    "goal": "One line at the top of the login code makes a counter called tries that starts at 0.",
    "blocks": [
    {"p": "Open frmLogin's code. Two places change. This screen is the first."},
    {"p": "Click the empty line above public frmLogin. Type the line below."},
    snip("2-1.c1", "A counter for wrong tries", "near the top of frmLogin's code, above the line public frmLogin",
         "private int tries = 0;",
         [[1, 1, "A counter that starts at 0", "A whole number called tries. It sits outside every button, so it keeps its value between clicks."]],
         ["tries"]),
    {"watch": "Type this line above public frmLogin, not inside btnLogin_Click. Inside the button, it would start again at 0 on every click."}
   ]},
   {"id": "2", "title": "Switch Login off on the third wrong try", "foot": "done",
    "goal": "On the third wrong try, a message shows and the Login button goes grey.",
    "blocks": [
    {"p": "Find the Login incorrect message near the bottom of btnLogin_Click. Two lines below it, tbxPassword is cleared."},
    {"p": "Click at the end of that tbxPassword line and press Enter. The new code goes there."},
    snip("2-2.c1", "Count the wrong tries", "near the bottom of btnLogin_Click, under the line that clears tbxPassword",
         "tries += 1;\nif (tries == 3)\n{\n    MessageBox.Show(\"Three wrong tries. The Login button is now off.\");\n    btnLogin.Enabled = false;\n}",
         [[1, 1, "One more wrong try", "Add 1 to tries each time the login is wrong."],
          [2, 6, "On the third, stop", "When tries is 3, a message shows. Then the Login button goes grey."]],
         ["tries", "btnLogin"])
   ]},
   {"id": "3", "title": "Try the three tries", "foot": "done",
    "goal": "I type a wrong password three times and the Login button goes grey.",
    "blocks": [
    {"p": "Run your program. Then try each row."},
    {"check": [
     tryit("2-3.t1", "Type a wrong password and click Login. Do it three times.", "On the third try, the message shows. The Login button goes grey.", "Look at screen 2-2.", "#cw/14/2-2"),
     tryit("2-3.t2", "After the third wrong try, type the right username and password.", "Login must NOT work, because the button is grey.", "If it works, look at screen 2-2.", "#cw/14/2-2", neg=True)]}
   ]}]},
  {"id": "3", "title": "Reaction test: the swaps speed up", "screens": [
   {"id": "1", "title": "Make the pictures swap faster each second", "foot": "done",
    "goal": "Every second the gap between swaps shrinks by a tenth of a second, down to 0.3 seconds.",
    "blocks": [
    {"p": "Open frmTest's code. Find tmrCountdown_Tick. Its first line takes 1 off CountdownValue. Click at the end of that line and press Enter."},
    snip("3-1.c1", "Faster swaps", "inside tmrCountdown_Tick, under the line that takes 1 off CountdownValue",
         "if (tmrSwap.Interval > 300)\n{\n    tmrSwap.Interval = tmrSwap.Interval - 100;\n}",
         [[1, 2, "Still slower than 0.3 seconds?", "Only when the gap between swaps is more than 300."],
          [3, 4, "Take a tenth off", "The gap gets 100 smaller. 100 is a tenth of a second."]],
         ["tmrSwap"]),
    {"yours": "MY tmrSwap starts at 1000. If YOURS starts lower, it reaches 300 sooner."}
   ]},
   {"id": "2", "title": "Try the faster swaps", "foot": "done",
    "goal": "I take the test and the swaps get faster as the clock runs down.",
    "blocks": [
    {"p": "Run your program. Log in and take the test. Then try each row."},
    {"check": [
     tryit("3-2.t1", "Watch the pictures as the clock counts down.", "The swaps get faster each second.", "Look at screen 3-1.", "#cw/14/3-1"),
     tryit("3-2.t2", "Watch the last few seconds.", "The pictures must NOT go too fast to click. They stay clear enough to click to the end.", "If they go too fast, look at screen 3-1.", "#cw/14/3-1", neg=True)]}
   ]}]},
  {"id": "4", "title": "Data entry: the best attempt", "screens": [
   {"id": "1", "title": "Show the best of the three attempts", "foot": "done",
    "goal": "After the average, the attempts heading also shows the biggest of the three attempts.",
    "blocks": [
    {"p": "Open frmDataEntry's code. Find btnCalculateAverage_Click. Click at the end of the line Global.attempt3 = and press Enter."},
    snip("4-1.c1", "The best attempt", "inside btnCalculateAverage_Click, under the three Global.attempt lines",
         "int best = Global.attempt1;\nif (Global.attempt2 > best)\n{\n    best = Global.attempt2;\n}\nif (Global.attempt3 > best)\n{\n    best = Global.attempt3;\n}\nlblSwimLengths.Text = \"Swim lengths (best: \" + best + \")\";",
         [[1, 1, "Start with attempt 1", "A whole number called best. It starts as attempt 1."],
          [2, 5, "Is attempt 2 bigger?", "When attempt 2 is bigger than best, best becomes attempt 2."],
          [6, 9, "Is attempt 3 bigger?", "When attempt 3 is bigger than best, best becomes attempt 3."],
          [10, 10, "Show it", "The attempts heading now shows the best attempt."]],
         ["best", "Global.attempt1", "Global.attempt2", "Global.attempt3", "lblSwimLengths"]),
    {"yours": "MY heading says Swim lengths. Use the words on YOUR heading."}
   ]},
   {"id": "2", "title": "Try the best attempt", "foot": "done",
    "goal": "I type three attempts and the heading shows the biggest one.",
    "blocks": [
    {"p": "Run your program. Log in and enter the details. Then try each row."},
    {"check": [
     tryit("4-2.t1", "Type 5, 6 and 8 as the attempts. Click the average button.", "The heading says best: 8.", "Look at screen 4-1.", "#cw/14/4-1"),
     tryit("4-2.t2", "Run again. Type 5, 9 and 2. Click the average button.", "The heading must NOT say best: 2. It says best: 9.", "If it says 2, look at screen 4-1.", "#cw/14/4-1", neg=True)]}
   ]}]},
  {"id": "5", "title": "Data entry: colour the group", "screens": [
   {"id": "1", "title": "Colour the group panel by the group", "foot": "done",
    "goal": "When the group appears, the group panel turns green, yellow or red.",
    "blocks": [
    {"p": "Open frmDataEntry's code. Find btnCalculateSwimmingGroup_Click. Click at the end of the line Global.assignedGroup = and press Enter."},
    snip("5-1.c1", "Colour the group panel", "inside btnCalculateSwimmingGroup_Click, under the Global.assignedGroup line and above the pnlSwimmingGroup.Enabled line",
         "if (Global.assignedGroup == \"Advanced\")\n{\n    pnlSwimmingGroup.BackColor = Color.LightGreen;\n}\nelse if (Global.assignedGroup == \"Intermediate\")\n{\n    pnlSwimmingGroup.BackColor = Color.Khaki;\n}\nelse\n{\n    pnlSwimmingGroup.BackColor = Color.LightCoral;\n}",
         [[1, 4, "The top group is green", "When the group is Advanced, the panel turns light green."],
          [5, 8, "The middle group is yellow", "else if asks a second question. When the group is Intermediate, the panel turns khaki, a soft yellow."],
          [9, 12, "Every other group is red", "else catches every other group. It turns the panel light red."]],
         ["Global.assignedGroup", "pnlSwimmingGroup"]),
    {"p": "The panel still turns grey after Calculate. It keeps its new colour."},
    {"yours": "MY groups are Advanced and Intermediate. Use the group names on YOUR task sheet, spelled the same as in chapter 10."}
   ]},
   {"id": "2", "title": "Try the coloured group", "foot": "chapter-done",
    "goal": "I work out a group and the panel turns its colour.",
    "blocks": [
    {"p": "Run your program. Do everything up to the group. Then try each row."},
    {"check": [
     tryit("5-2.t1", "Get all 5 quiz questions right. Click 6 winning pictures. Type 8, 8 and 8 as the attempts. Click Calculate.", "YOUR top group shows. The group panel turns green.", "Look at screen 5-1.", "#cw/14/5-1"),
     tryit("5-2.t2", "Run again. Get 1 quiz question right. Click 1 winning picture. Type 2, 2 and 2 as the attempts. Click Calculate.", "The panel must NOT be green. It turns light red.", "If it is green, look at screen 5-1.", "#cw/14/5-1", neg=True)]}
   ]}]}
 ]}
