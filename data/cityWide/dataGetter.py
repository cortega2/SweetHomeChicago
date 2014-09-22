#! /usr/bin/python
import xlrd
import csv

workbook = xlrd.open_workbook('../community/Race by Community Area 2000-2010.xlsx')
worksheet = workbook.sheet_by_name('Sheet1')

c = csv.writer(open("../community/raceByCommunity_2010.csv.", "wb"))
c.writerow(["area", "NHW", "NHB", "NHAM", "NHAS", "NH Other", "HISP", "NH Multiple", "total"])
# c.writerow(["race", "total", "year"])

num_rows = worksheet.nrows - 1
community_counter = 1.0
for n in range(0, num_rows):
    # c.writerow ([worksheet.cell_value(1,(3*n) + 1), worksheet.cell_value(20, (n+1)*3), "1990"])
    # print community_counter
    # print worksheet.cell_value(n, 11)

    if str(worksheet.cell_value(n, 11)) == str(community_counter):
        # com = worksheet.cell_value(n, 1)
        # m_start = 2
        # f_start = 106

        # for x in range(0,100):
        c.writerow([int(worksheet.cell_value(n, 11)),
            int(worksheet.cell_value(n, 13)), 
            int(worksheet.cell_value(n, 14)),  
            int(worksheet.cell_value(n, 15)),
            int(worksheet.cell_value(n, 16)),
            int(worksheet.cell_value(n, 17)),
            int(worksheet.cell_value(n, 18)),
            int(worksheet.cell_value(n, 19)),
            int(worksheet.cell_value(n, 20))]) 
    
        community_counter += 1;
        # for x in range(n, num_rows):
        #     if worksheet.cell_value(x, 1) == com:
        #         c.writerow ([community_counter, worksheet.cell_value(x, 0), worksheet.cell_value(x, 367)])
        #     else:
        #         break
        # community_counter += 1

    # c.writerow ([worksheet.cell_value(n, 0), worksheet.cell_value(n, 16), worksheet.cell_value(n, 17), worksheet.cell_value(n, 18), "1990"])


# for n in range(29, 46):
#     # c.writerow ([worksheet.cell_value(27,(3*n) + 1), worksheet.cell_value(46, (n+1)*3), "2000"])
#     c.writerow ([worksheet.cell_value(n, 0), worksheet.cell_value(n, 16), worksheet.cell_value(n, 17), worksheet.cell_value(n, 18), "2000"])