// http://pastebin.com/kMg4UkTn

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Xml;
using System.Text.RegularExpressions;

namespace CsprojOption
{
    class Program
    {
        static string PATH = @"D:\dev";

        static void Do(string path)
        {
            var endsWithNewline = false;
            var encoding = Encoding.UTF8;
            var hasXmlDeclaration = true;
            using (var reader = new StreamReader(path, true))
            {
                var s = reader.ReadToEnd();
                endsWithNewline = s.EndsWith("\r\n");
                encoding = reader.CurrentEncoding;
                hasXmlDeclaration = s.StartsWith("<?");
            }

            var document = new XmlDocument();
            document.Load(path);
            foreach (XmlNode node in document.DocumentElement.ChildNodes)
            {
                if (node.Name != "PropertyGroup") continue;
                var attr = node.Attributes["Condition"];
                if (attr == null) continue;
                var condition = attr.Value;
                if (!condition.Contains("Debug")) continue;
                foreach (XmlNode inner_node in node.ChildNodes)
                {
                    if (inner_node.Name != "Optimize") continue;
                    var optimize = inner_node.InnerText;
                    if (Boolean.Parse(optimize))
                    {
                        inner_node.InnerText = "false";
                    }
                }
            }
            var writer_setting = new XmlWriterSettings()
            {
                Indent = true,
                Encoding = encoding,
                OmitXmlDeclaration = !hasXmlDeclaration,
            };
            using (var writer = XmlWriter.Create(path, writer_setting))
            {
                document.WriteTo(writer);
            }

            var builder = new StringBuilder();
            using (var reader = new StreamReader(path, encoding))
            {
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    if (line.Contains("></"))
                    {
                        line = line.Replace("></", ">\r\n" + new string(' ', line.IndexOf('<')) + "</");
                    }
                    builder.Append(line);
                    if (!reader.EndOfStream || endsWithNewline)
                    {
                        builder.AppendLine();
                    }
                }
            }
            using (var writer = new StreamWriter(path, false, encoding))
            {
                writer.Write(builder.ToString());
            }
        }

        static void Do2(string path)
        {
            string s;
            var encoding = Encoding.UTF8;
            using (var reader = new StreamReader(path, true))
            {
                s = reader.ReadToEnd();
                encoding = reader.CurrentEncoding;
            }
            var changed = false;
            var start_index = 0;
            while (true)
            {
                var index = s.IndexOf("<Optimize>true</Optimize>", start_index);
                if (index < 0) break;

                var replaced = false;
                var a = s.Substring(0, index).LastIndexOf("<PropertyGroup");
                var b = s.Substring(a).IndexOf('>');
                if (s.Substring(a, b).Contains("Debug"))
                {
                    s = s.Remove(index, 25);
                    s = s.Insert(index, "<Optimize>false</Optimize>");
                    replaced = true;
                    changed = true;
                }

                start_index = index + (replaced ? 2 : 1);
            }
            if (changed)
            {
                using (var writer = new StreamWriter(path, false, encoding))
                {
                    writer.Write(s);
                }
            }
        }

        static void Main(string[] args)
        {
            foreach (var path in Directory.GetFiles(PATH, "*.csproj", SearchOption.AllDirectories))
            {
                var dir_name = Path.GetDirectoryName(path);
                if (dir_name.EndsWith(".svn")) continue;
                if (dir_name.Split('\\').Contains("tags")) continue;
                Do2(path);
            }
        }
    }
}
