#!/usr/bin/python3


from pathlib import Path
import os
from datetime import datetime
from collections import defaultdict
from matplotlib import pyplot as plt
from dateutil import parser
import subprocess

import pandas as pd


def get_ctime(p):
    rs = subprocess.check_output(["stat", "-c" "\'%w\'", p]).split()[0]
    # extract path from filename as  possible
    file_name = os.path.basename(p)
    if file_name.startswith('2021'):
        try:
            return datetime.strptime(file_name[:8], '%Y%m%d')
        except Exception as e:
            # print(e)
            pass
    return parser.parse(rs)


# exclude README.md
c = 0

mtime_group = defaultdict(int)
ctime_group = defaultdict(int)

for file_path in Path('./notes').glob('**/*.md'):
    c_time = get_ctime(str(file_path))
    # c_time = datetime.fromtimestamp(p.st_mtime).replace(hour=0, minute=0, second=0, microsecond=0).strftime(('%d/%m/%y'))
    ctime_group[c_time] += 1

    c += 1

# mtime_group = list([[k, v] for k, v in mtime_group.items()])
ctime_group = list([[k, v] for k, v in ctime_group.items()])
ctime_group = sorted(ctime_group, key=lambda x: x[0])
# import ipdb; ipdb.set_trace()
data = pd.DataFrame(ctime_group)
data[1] = data[1].cumsum()

fig = plt.figure(figsize=(32, 18), dpi=64)
# fig, ax = plt.subplots()
plt.plot(data[0], data[1], marker='o', color='tab:gray')
fig.autofmt_xdate()
plt.title('Number of notes', fontsize=14)
plt.savefig('stats.png')

#with open('README.md.tmp', 'w') as f:
#    f.write('# Less\n')
#    f.write('More is less.\n')
#    f.write('\n')
#    f.write('## Stats\n')
#    f.write('- Number of notes: {}'.format(c))

#    f.write('\n\n![stats.png](stats.png)')

#os.rename('README.md.tmp', 'README.md')
