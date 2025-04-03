import csv
import datetime
import os
def flatten_data(y):
    out = {}

    def flatten(x, name=''):
        if isinstance(x, dict):
            for a in x:
                flatten(x[a], name + a + '_')
        elif type(x) is list:
            for i, a in enumerate(x):
                flatten(a, name + str(i) + '_')
        else:
            out[name[:-1]] = x

    flatten(y)
    return out

def write_to_csv(data, filename = f'./csv/{datetime.date.today()}.csv'):
    
    values = data.values()
    os.makedirs('./csv', exist_ok=True)
    with open(filename, mode='a', newline='') as file:
        writer = csv.writer(file)
        if file.tell() == 0:
            keys = data.keys()
            writer.writerow(keys)
        writer.writerow(values)


